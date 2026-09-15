const {Pool} = require('pg');
const security = require('../server/castelinho/security.cjs');
let pool;
const origins = new Set(['https://www.delumo.com.br', 'https://delumo.com.br']);

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, private');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const reply = (status, body) => res.status(status).json(body);
  const action = req.query.action || 'project';
  const enabled = security.configured(process.env);
  if (req.method === 'GET' && action === 'status') return reply(200, {configured:enabled, access:'public'});
  if (!enabled) return reply(503, {error:'O banco de dados ainda não foi conectado. A cópia local continua disponível.'});
  if (!['GET','PUT'].includes(req.method)) {res.setHeader('Allow','GET, PUT');return reply(405,{error:'Método não permitido.'});}
  if (req.method !== 'GET' && !origins.has(req.headers.origin)) return reply(403, {error:'Origem não permitida.'});
  if (action !== 'project') return reply(404, {error:'Recurso inexistente.'});
  if (!['GET','PUT'].includes(req.method)) return reply(405, {error:'Método não permitido.'});
  let data;
  if (req.method === 'PUT') {
    if (JSON.stringify(req.body || {}).length > 100000) return reply(413, {error:'Proposta muito grande.'});
    if (!Number.isSafeInteger(req.body?.revision) || req.body.revision < 0) return reply(400, {error:'Revisão inválida.'});
    try {data = security.validate(req.body.data);} catch (error) {return reply(400, {error:error.message});}
  }
  try {
    pool ||= new Pool({connectionString:process.env.CASTELINHO_DATABASE_URL, max:2, connectionTimeoutMillis:8000, idleTimeoutMillis:10000});
    if (req.method === 'GET') {
      const result = await pool.query('SELECT revision, data, updated_at FROM castelinho_proposals WHERE id = $1', ['castelinho-vivo']);
      const row = result.rows[0];
      return reply(200, row ? {revision:Number(row.revision),data:row.data,savedAt:row.updated_at} : {revision:0,data:null});
    }
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // Serializes the first insert as well as subsequent edits across devices.
      await client.query('SELECT pg_advisory_xact_lock($1)', [20261112]);
      const current = await client.query('SELECT revision FROM castelinho_proposals WHERE id = $1', ['castelinho-vivo']);
      const revision = Number(current.rows[0]?.revision || 0);
      if (revision !== req.body.revision) {await client.query('ROLLBACK');return reply(409, {error:'Existe uma versão mais recente salva por outro aparelho.'});}
      const next = revision + 1;
      const result = await client.query('INSERT INTO castelinho_proposals (id, revision, data) VALUES ($1, $2, $3) ON CONFLICT (id) DO UPDATE SET revision = EXCLUDED.revision, data = EXCLUDED.data, updated_at = now() RETURNING updated_at', ['castelinho-vivo',next,data]);
      await client.query('INSERT INTO castelinho_proposal_history (proposal_id, revision, data) VALUES ($1, $2, $3)', ['castelinho-vivo',next,data]);
      await client.query('COMMIT');
      return reply(200, {revision:next,savedAt:result.rows[0].updated_at});
    } catch (error) {await client.query('ROLLBACK');throw error;} finally {client.release();}
  } catch {
    // Never return database errors, connection strings or submitted data.
    return reply(503, {error:'Não foi possível acessar o banco agora. Sua cópia local foi mantida; tente salvar novamente.'});
  }
};
