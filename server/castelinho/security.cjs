const crypto = require('node:crypto');
const fields = require('./fields.json');
const cookieName = '__Host-castelinho';

function equal(a, b) {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function configured(env) {
  return Boolean(env.CASTELINHO_DATABASE_URL && /^[a-f0-9]{64}$/i.test(env.CASTELINHO_ACCESS_HASH || '') && (env.CASTELINHO_SESSION_SECRET || '').length >= 32);
}
function validKey(key, env) {
  return typeof key === 'string' && key.length >= 32 && key.length <= 256 && equal(crypto.createHash('sha256').update(key).digest('hex'), env.CASTELINHO_ACCESS_HASH || '');
}
function signature(value, env) {
  return crypto.createHmac('sha256', env.CASTELINHO_SESSION_SECRET).update(value + ':' + env.CASTELINHO_ACCESS_HASH).digest('base64url');
}
function session(env, now = Date.now()) {
  const value = String(now + 7 * 86400000);
  return `${value}.${signature(value, env)}`;
}
function authorized(cookie, env, now = Date.now()) {
  const value = String(cookie || '').split(';').map(v => v.trim()).find(v => v.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
  if (!value) return false;
  const [expires, mac, extra] = value.split('.');
  return !extra && /^\d{13}$/.test(expires) && Number(expires) > now && Number(expires) <= now + 7 * 86400000 && equal(mac || '', signature(expires, env));
}
function validate(data) {
  if (!data || data.project !== 'castelinho-vivo' || data.version !== 3 || !data.values || Array.isArray(data.values) || typeof data.values !== 'object') throw Error('Proposta inválida.');
  if (!Number.isInteger(data.selectedMission) || data.selectedMission < 0 || data.selectedMission > 6) throw Error('Capítulo inválido.');
  const values = {};
  for (const field of fields) {
    const v = data.values[field.id];
    if (field.type === 'checkbox') {
      if (typeof v !== 'boolean') throw Error('Marcação inválida.');
    } else {
      if (typeof v !== 'string' || v.length > Number(field.maxlength || 100)) throw Error('Campo inválido.');
      if (v && field.type === 'number' && (!Number.isFinite(Number(v)) || Math.abs(Number(v)) > 1e15)) throw Error('Número inválido.');
      if (v && ['date','datetime-local'].includes(field.type)) {
        const regex = field.type === 'date' ? /^\d{4}-\d{2}-\d{2}$/ : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        const parsed = new Date(v + (field.type === 'date' ? 'T00:00:00Z' : ':00Z'));
        if (!regex.test(v) || Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, v.length) !== v) throw Error('Data inválida.');
      }
    }
    values[field.id] = v;
  }
  return {project:'castelinho-vivo',version:3,selectedMission:data.selectedMission,values};
}
module.exports = {cookieName, configured, validKey, session, authorized, validate};
