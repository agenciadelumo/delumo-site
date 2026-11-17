// Captação de interessados da Associação dos Amigos do Castelinho (delumo.com.br/sociocastelinho).
// POST público grava o cadastro no Neon (CASTELINHO_DATABASE_URL).
// GET com cabeçalho "x-admin-key" igual a SOCIO_CASTELINHO_ADMIN_KEY exporta a lista (JSON ou ?format=csv).
const { Pool } = require("pg");
let pool;
let ready;
const origins = new Set([
  "https://www.delumo.com.br",
  "https://delumo.com.br",
]);
const interesses = new Set(["socio", "voluntario", "colaborar"]);

const clean = (value, max) =>
  String(value ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);

function validate(body) {
  if (!body || typeof body !== "object") throw Error("Dados inválidos.");
  if (clean(body.website, 200)) throw Error("Envio recusado."); // honeypot
  const nome = clean(body.nome, 120);
  const email = clean(body.email, 160).toLowerCase();
  const whatsapp = clean(body.whatsapp, 30).replace(/[^\d+()\-\s]/g, "");
  const cidade = clean(body.cidade, 80);
  const mensagem = clean(body.mensagem, 1000);
  const lista = Array.isArray(body.interesse) ? body.interesse : [body.interesse];
  const interesse = [...new Set(lista.map((i) => clean(i, 20)).filter((i) => interesses.has(i)))];
  if (nome.length < 3) throw Error("Informe seu nome completo.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw Error("Informe um e-mail válido.");
  if (whatsapp.replace(/\D/g, "").length < 10) throw Error("Informe um WhatsApp com DDD.");
  if (!interesse.length) throw Error("Escolha pelo menos uma forma de participar.");
  if (body.consentimento !== true) throw Error("É preciso autorizar o contato.");
  return { nome, email, whatsapp, cidade, mensagem, interesse, origem: clean(body.origem, 120) };
}

async function db() {
  pool ||= new Pool({
    connectionString: process.env.CASTELINHO_DATABASE_URL,
    max: 2,
    connectionTimeoutMillis: 8000,
    idleTimeoutMillis: 10000,
  });
  ready ||= pool
    .query(
      `CREATE TABLE IF NOT EXISTS castelinho_socios (
        id bigserial PRIMARY KEY,
        nome text NOT NULL,
        email text NOT NULL,
        whatsapp text NOT NULL,
        cidade text,
        interesse text[] NOT NULL,
        mensagem text,
        origem text,
        created_at timestamptz NOT NULL DEFAULT now()
      )`,
    )
    .catch((error) => {
      ready = undefined;
      throw error;
    });
  await ready;
  return pool;
}

const csv = (rows) => {
  const cols = ["created_at", "nome", "email", "whatsapp", "cidade", "interesse", "mensagem", "origem"];
  const cell = (v) => `"${String(Array.isArray(v) ? v.join(" | ") : v instanceof Date ? v.toISOString() : v ?? "").replace(/"/g, '""')}"`;
  return "﻿" + [cols.join(";"), ...rows.map((r) => cols.map((c) => cell(r[c])).join(";"))].join("\n");
};

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, private");
  res.setHeader("X-Content-Type-Options", "nosniff");
  const reply = (status, body) => res.status(status).json(body);
  const configured = Boolean(process.env.CASTELINHO_DATABASE_URL);

  if (req.method === "GET" && req.query.action === "status") return reply(200, { configured });

  if (req.method === "GET") {
    const key = process.env.SOCIO_CASTELINHO_ADMIN_KEY;
    if (!key || key.length < 16 || req.headers["x-admin-key"] !== key)
      return reply(401, { error: "Acesso restrito." });
    if (!configured) return reply(503, { error: "Banco não configurado." });
    try {
      const result = await (await db()).query(
        "SELECT nome, email, whatsapp, cidade, interesse, mensagem, origem, created_at FROM castelinho_socios ORDER BY created_at DESC LIMIT 5000",
      );
      if (req.query.format === "csv") {
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", 'attachment; filename="socios-castelinho.csv"');
        return res.status(200).send(csv(result.rows));
      }
      return reply(200, { total: result.rowCount, leads: result.rows });
    } catch {
      return reply(503, { error: "Não foi possível consultar o banco agora." });
    }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return reply(405, { error: "Método não permitido." });
  }
  if (!origins.has(req.headers.origin)) return reply(403, { error: "Origem não permitida." });
  if (JSON.stringify(req.body || {}).length > 5000) return reply(413, { error: "Cadastro muito grande." });
  if (!configured) return reply(503, { error: "Cadastro temporariamente indisponível." });

  let lead;
  try {
    lead = validate(req.body);
  } catch (error) {
    return reply(400, { error: error.message });
  }
  try {
    const client = await db();
    const recent = await client.query(
      "SELECT 1 FROM castelinho_socios WHERE email = $1 AND created_at > now() - interval '2 minutes' LIMIT 1",
      [lead.email],
    );
    if (!recent.rowCount)
      await client.query(
        "INSERT INTO castelinho_socios (nome, email, whatsapp, cidade, interesse, mensagem, origem) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [lead.nome, lead.email, lead.whatsapp, lead.cidade || null, lead.interesse, lead.mensagem || null, lead.origem || null],
      );
    return reply(201, { ok: true });
  } catch {
    // Nunca devolver erros do banco nem os dados enviados.
    return reply(503, { error: "Não foi possível salvar agora. Tente novamente em instantes." });
  }
};

module.exports.validate = validate;
