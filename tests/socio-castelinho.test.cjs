const test = require("node:test");
const assert = require("node:assert/strict");
const handler = require("../api/socio-castelinho.js");

const valid = {
  nome: "Maria da Silva",
  email: "maria@example.com",
  whatsapp: "(54) 99999-8888",
  cidade: "Erechim",
  interesse: ["socio", "voluntario"],
  consentimento: true,
};

function call(req) {
  return new Promise((resolve) => {
    const res = {
      headers: {},
      setHeader(k, v) { this.headers[k] = v; },
      status(code) { this.code = code; return this; },
      json(body) { resolve({ code: this.code, body }); },
      send(body) { resolve({ code: this.code, body }); },
    };
    handler({ query: {}, headers: {}, ...req }, res);
  });
}

test("valida e normaliza um cadastro completo", () => {
  const lead = handler.validate({ ...valid, email: " Maria@Example.com ", interesse: ["socio", "x", "socio"] });
  assert.equal(lead.email, "maria@example.com");
  assert.deepEqual(lead.interesse, ["socio"]);
});

test("recusa dados incompletos, honeypot e falta de consentimento", () => {
  assert.throws(() => handler.validate({ ...valid, nome: "A" }), /nome/);
  assert.throws(() => handler.validate({ ...valid, email: "x@" }), /e-mail/);
  assert.throws(() => handler.validate({ ...valid, whatsapp: "123" }), /WhatsApp/);
  assert.throws(() => handler.validate({ ...valid, interesse: [] }), /forma/);
  assert.throws(() => handler.validate({ ...valid, consentimento: false }), /autorizar/);
  assert.throws(() => handler.validate({ ...valid, website: "spam.com" }), /recusado/);
});

test("bloqueia origem externa e listagem sem chave", async () => {
  const post = await call({ method: "POST", headers: { origin: "https://evil.example" }, body: valid });
  assert.equal(post.code, 403);
  const list = await call({ method: "GET" });
  assert.equal(list.code, 401);
  const put = await call({ method: "PUT" });
  assert.equal(put.code, 405);
});

test("informa indisponibilidade sem banco configurado", async () => {
  const saved = process.env.CASTELINHO_DATABASE_URL;
  delete process.env.CASTELINHO_DATABASE_URL;
  const r = await call({ method: "POST", headers: { origin: "https://delumo.com.br" }, body: valid });
  assert.equal(r.code, 503);
  if (saved) process.env.CASTELINHO_DATABASE_URL = saved;
});
