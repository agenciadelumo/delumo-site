const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const security = require('../server/castelinho/security.cjs');
const fields = require('../server/castelinho/fields.json');
const handler = require('../api/castelinho');
const key = crypto.randomBytes(32).toString('base64url');
const env = {CASTELINHO_DATABASE_URL:'postgres://test',CASTELINHO_ACCESS_HASH:crypto.createHash('sha256').update(key).digest('hex'),CASTELINHO_SESSION_SECRET:crypto.randomBytes(32).toString('hex')};
const data = () => ({project:'castelinho-vivo',version:3,selectedMission:0,values:Object.fromEntries(fields.map(f=>[f.id,f.type==='checkbox'?false:'']))});

test('access requires complete configuration and the correct strong key', () => {
  assert.equal(security.configured({}),false);
  assert.equal(security.configured(env),true);
  assert.equal(security.validKey(key,env),true);
  assert.equal(security.validKey('wrong',env),false);
  assert.equal(security.validKey(key+'x',env),false);
});
test('session rejects forgery, expiry and rotated access keys', () => {
  const now = Date.now(), token = security.session(env,now), cookie=security.cookieName+'='+token;
  assert.equal(security.authorized(cookie,env,now+1000),true);
  assert.equal(security.authorized(cookie+'x',env,now+1000),false);
  assert.equal(security.authorized(cookie,env,now+8*86400000),false);
  assert.equal(security.authorized(cookie,{...env,CASTELINHO_ACCESS_HASH:'f'.repeat(64)},now+1000),false);
});
test('server validates all 51 fields, dates, values and notes and strips unknown keys', () => {
  const draft=data();draft.values['cost-projectors']='16000.00';draft.values['supplier-projectors']='Marca / fornecedor';draft.values['date-concept']='2026-11-01';draft.values['meeting-notes']='Decisão da equipe';draft.values.injected='ignored';
  const clean=security.validate(draft);
  assert.equal(Object.keys(clean.values).length,51);
  assert.equal(clean.values['supplier-projectors'],'Marca / fornecedor');
  assert.equal(clean.values.injected,undefined);
  assert.throws(()=>security.validate({...draft,project:'other-project'}));
  draft.values['date-concept']='2026-02-30';assert.throws(()=>security.validate(draft));
  draft.values['date-concept']='';draft.values['meeting-notes']='x'.repeat(6001);assert.throws(()=>security.validate(draft));
  draft.values['meeting-notes']='';delete draft.values['supplier-projectors'];assert.throws(()=>security.validate(draft));
});
test('public API fails closed before configuration and rejects unauthenticated or foreign-origin writes', async () => {
  const original={};for(const k of Object.keys(env)){original[k]=process.env[k];delete process.env[k];}
  const call=async req=>{const res={headers:{},setHeader(k,v){this.headers[k]=v},status(v){this.code=v;return this},json(v){this.body=v;return this}};await handler({headers:{},query:{},...req},res);return res};
  try {
    assert.equal((await call({method:'GET',query:{action:'status'}})).body.configured,false);
    assert.equal((await call({method:'PUT',body:{}})).code,503);
    Object.assign(process.env,env);
    assert.equal((await call({method:'GET'})).code,401);
    assert.equal((await call({method:'PUT',headers:{origin:'https://other.example'}})).code,403);
    const login=await call({method:'POST',query:{action:'login'},headers:{origin:'https://www.delumo.com.br'},body:{key}});
    assert.equal(login.code,200);assert.match(login.headers['Set-Cookie'],/HttpOnly; Secure; SameSite=Strict/);
    const invalid=await call({method:'PUT',headers:{origin:'https://www.delumo.com.br',cookie:login.headers['Set-Cookie']},body:{revision:0,data:{}}});
    assert.equal(invalid.code,400);
  } finally {for(const k of Object.keys(env)){if(original[k]===undefined)delete process.env[k];else process.env[k]=original[k];}}
});
