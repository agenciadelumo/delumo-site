const proposalFields = require("./fields.json");

const budgetCostIds = [
  ...Array.from({ length: 20 }, (_, index) => index + 1),
  26,
  27,
  31,
];

const budgetFields = [
  ...budgetCostIds.map((index) => {
    const id = String(index).padStart(2, "0");
    return [
      { id: `unit-cost-${id}`, type: "number", maxlength: "100" },
      { id: `cost-date-${id}`, type: "date", maxlength: "100" },
      { id: `cost-confirmed-${id}`, type: "checkbox" },
    ];
  }).flat(),
  { id: "budget-notes", maxlength: "6000" },
  ...[
    "concept",
    "assets",
    "technical",
    "prototype",
    "production",
    "rehearsal",
    "setup",
  ].flatMap((id) => [
    { id: `date-${id}`, type: "date", maxlength: "100" },
    { id: `owner-${id}`, type: "text", maxlength: "150" },
    { id: `reference-${id}`, type: "url", maxlength: "2048" },
    { id: `observations-${id}`, maxlength: "10000" },
    { id: `done-${id}`, type: "checkbox" },
  ]),
  { id: "meeting-notes", maxlength: "10000" },
];

function configured(env) {
  return Boolean(env.CASTELINHO_DATABASE_URL);
}

function validateDate(value) {
  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(parsed.valueOf()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

function validateValues(data, fields) {
  const values = {};
  for (const field of fields) {
    const value = data.values[field.id];
    if (field.type === "checkbox") {
      if (typeof value !== "boolean") throw Error("Marcação inválida.");
    } else {
      if (
        typeof value !== "string" ||
        value.length > Number(field.maxlength || 100)
      )
        throw Error("Campo inválido.");
      if (
        value &&
        field.type === "number" &&
        (!Number.isFinite(Number(value)) ||
          Number(value) < 0 ||
          Math.abs(Number(value)) > 1e15)
      )
        throw Error("Número inválido.");
      if (value && field.type === "date" && !validateDate(value))
        throw Error("Data inválida.");
      if (value && field.type === "datetime-local") {
        const parsed = new Date(`${value}:00Z`);
        if (
          !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value) ||
          Number.isNaN(parsed.valueOf()) ||
          parsed.toISOString().slice(0, 16) !== value
        )
          throw Error("Data inválida.");
      }
      if (value && field.type === "url") {
        let url;
        try {
          url = new URL(value);
        } catch {
          throw Error("Link inválido.");
        }
        if (!["http:", "https:"].includes(url.protocol))
          throw Error("Link inválido.");
      }
    }
    values[field.id] = value;
  }
  return values;
}

function validate(data) {
  if (
    !data ||
    !data.values ||
    Array.isArray(data.values) ||
    typeof data.values !== "object"
  )
    throw Error("Proposta inválida.");
  if (data.project === "castelinho-orcamento") {
    if (
      data.version !== 1 ||
      !Number.isInteger(data.selectedMission) ||
      data.selectedMission < 0 ||
      data.selectedMission > 0
    )
      throw Error("Orçamento inválido.");
    return {
      project: "castelinho-orcamento",
      version: 1,
      selectedMission: data.selectedMission,
      values: validateValues(data, budgetFields),
    };
  }
  if (data.project !== "castelinho-vivo" || ![3, 4].includes(data.version))
    throw Error("Proposta inválida.");
  if (
    !Number.isInteger(data.selectedMission) ||
    data.selectedMission < 0 ||
    data.selectedMission > (data.version === 3 ? 6 : 3)
  )
    throw Error("Capítulo inválido.");
  return {
    project: "castelinho-vivo",
    version: 4,
    selectedMission:
      data.version === 3
        ? ({ 0: 1, 3: 0, 4: 2, 6: 3 }[data.selectedMission] ?? 0)
        : data.selectedMission,
    values: validateValues(data, proposalFields),
  };
}

module.exports = { configured, validate };
