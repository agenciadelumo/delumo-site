const fields = require('./fields.json');
function configured(env) { return Boolean(env.CASTELINHO_DATABASE_URL); }
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
module.exports = {configured, validate};
