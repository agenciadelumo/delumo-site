const test = require('node:test');
const assert = require('node:assert/strict');
const {Pool} = require('pg');
const security = require('../server/castelinho/security.cjs');
const fields = require('../server/castelinho/fields.json');
const handler = require('../api/castelinho');
const data = () => ({project:'castelinho-vivo',version:4,selectedMission:0,values:Object.fromEntries(fields.map(f=>[f.id,f.type==='checkbox'?false:'']))});

test('public access needs only the database connection', () => {
  assert.equal(security.configured({}),false);
  assert.equal(security.configured({CASTELINHO_DATABASE_URL:'postgres://test'}),true);
});
test('server validates all 48 fields, dates, values and notes and strips unknown keys', () => {
  const draft=data();draft.values['cost-projectors']='16000.00';draft.values['supplier-projectors']='Marca / fornecedor';draft.values['date-concept']='2026-11-01';draft.values['meeting-notes']='Decisão da equipe';draft.values.injected='ignored';
  const clean=security.validate(draft);
  assert.equal(Object.keys(clean.values).length,48);
  assert.equal(clean.values['supplier-projectors'],'Marca / fornecedor');
  assert.equal(clean.values.injected,undefined);
  const olderBudget={...draft,values:{...draft.values,'cost-management':'3500','supplier-management':'Fornecedor anterior'}};
  assert.deepEqual(security.validate(olderBudget),clean);
  assert.throws(()=>security.validate({...draft,project:'other-project'}));
  draft.values['date-concept']='2026-02-30';assert.throws(()=>security.validate(draft));
  draft.values['date-concept']='';draft.values['meeting-notes']='x'.repeat(6001);assert.throws(()=>security.validate(draft));
  draft.values['meeting-notes']='';delete draft.values['supplier-projectors'];assert.throws(()=>security.validate(draft));
});

test('legacy chapters migrate by theme and retain all remaining proposal fields', () => {
  const mapping=[1,0,0,0,2,0,3];
  mapping.forEach((expected,oldIndex)=>{
    const old={...data(),version:3,selectedMission:oldIndex};
    old.values['photo-reference']='Removed photo';
    old.values['supplier-projectors']='Existing supplier';
    old.values['meeting-notes']='Existing decisions';
    const migrated=security.validate(old);
    assert.equal(migrated.version,4);
    assert.equal(migrated.selectedMission,expected);
    assert.equal(migrated.values['photo-reference'],undefined);
    assert.equal(migrated.values['supplier-projectors'],'Existing supplier');
    assert.equal(migrated.values['meeting-notes'],'Existing decisions');
    assert.deepEqual(security.validate(migrated),migrated);
  });
  assert.throws(()=>security.validate({...data(),selectedMission:4}));
});

test('browser migration agrees with server and removes the retired field from fingerprints', () => {
  const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
  const app=fs.readFileSync(path.join(__dirname,'../propostacastelinho/app.js'),'utf8');
  const cloud=fs.readFileSync(path.join(__dirname,'../propostacastelinho/cloud.js'),'utf8');
  const context=vm.createContext({fields:fields.map(f=>({...f,maxLength:Number(f.maxlength||-1)})),missions:Array(4)});
  vm.runInContext(app.slice(app.indexOf('function validateSaved('),app.indexOf('function applySaved(')),context);
  const fingerprint=vm.runInContext('('+cloud.match(/const fingerprint = (.*);/)[1]+')',context);
  for(let i=0;i<7;i++) {
    const legacy={...data(),version:3,selectedMission:i};
    legacy.values['photo-reference']='Old image';
    context.legacy=legacy;
    const result=vm.runInContext('validateSaved(legacy)',context);
    assert.equal(fingerprint(result),fingerprint(security.validate(legacy)));
  }
});

test('anonymous reads work while invalid writes and foreign origins remain rejected', async t => {
  const original=process.env.CASTELINHO_DATABASE_URL;
  delete process.env.CASTELINHO_DATABASE_URL;
  const call=async req=>{const res={headers:{},setHeader(k,v){this.headers[k]=v},status(v){this.code=v;return this},json(v){this.body=v;return this}};await handler({headers:{},query:{},...req},res);return res};
  try {
    assert.equal((await call({method:'GET',query:{action:'status'}})).body.configured,false);
    assert.equal((await call({method:'PUT',body:{}})).code,503);
    process.env.CASTELINHO_DATABASE_URL='postgres://test';
    const draft=data();
    t.mock.method(Pool.prototype,'query',async()=>({rows:[{revision:7,data:draft,updated_at:'2026-09-15T12:00:00Z'}]}));
    const read=await call({method:'GET'});
    assert.equal(read.code,200);assert.deepEqual(read.body.data,draft);
    const status=await call({method:'GET',query:{action:'status'}});
    assert.equal(status.body.access,'public');
    assert.equal((await call({method:'PUT',headers:{origin:'https://other.example'}})).code,403);
    assert.equal((await call({method:'PUT',headers:{origin:'https://www.delumo.com.br'},body:{revision:7,data:{}}})).code,400);
    assert.equal((await call({method:'POST',query:{action:'login'}})).code,405);
  } finally {if(original===undefined)delete process.env.CASTELINHO_DATABASE_URL;else process.env.CASTELINHO_DATABASE_URL=original;}
});

test('JSONB field ordering does not create a false browser conflict', () => {
  const source=require('node:fs').readFileSync(require('node:path').join(__dirname,'../propostacastelinho/cloud.js'),'utf8');
  const expression=source.match(/const fingerprint = (.*);/)[1];
  const fingerprint=require('node:vm').runInNewContext('('+expression+')');
  const draft=data();draft.values['supplier-projectors']='Fornecedor';
  const reordered={...draft,values:Object.fromEntries(Object.entries(draft.values).reverse())};
  assert.equal(fingerprint(draft),fingerprint(reordered));
  reordered.values['supplier-projectors']='Outra cotação';
  assert.notEqual(fingerprint(draft),fingerprint(reordered));
});
