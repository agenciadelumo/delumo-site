"use strict";

const missions = [true];
const $ = (id) => document.getElementById(id);
const storageKey = "delumo.castelinho.orcamento.v1";
const fields = [...document.querySelectorAll("[data-save]")];
const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const dateFormat = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });
let selectedMission = 0;
let storageHealthy = true;

function setText(id, text) {
  const element = $(id);
  if (element) element.textContent = text;
}

function selectMission(index) {
  selectedMission = missions[index] ? index : 0;
}

function budget() {
  const rows = [...document.querySelectorAll("[data-cost-row]")];
  let grandTotal = 0;
  let filled = 0;
  let invalid = false;
  let confirmed = 0;
  rows.forEach((row) => {
    const unit = row.querySelector("[data-unit-cost]");
    const output = row.querySelector("[data-cost-output]");
    const checked = row.querySelector('input[type="checkbox"]');
    const bad = unit.value !== "" && !unit.validity.valid;
    unit.setAttribute("aria-invalid", String(bad));
    invalid ||= bad;
    confirmed += checked.checked ? 1 : 0;
    if (unit.value === "" || bad) {
      output.value = bad ? "Revisar" : "—";
      return;
    }
    const total = Number(unit.value) * Number(row.dataset.quantity || 1);
    output.value = money.format(total);
    grandTotal += total;
    filled++;
  });
  setText(
    "budget-error",
    invalid
      ? "Revise os valores destacados: use valores positivos ou zero, com até duas casas decimais."
      : "",
  );
  setText(
    "budget-total",
    invalid
      ? "Revisar campos"
      : filled
        ? money.format(grandTotal)
        : "Nenhum valor informado",
  );
  setText(
    "budget-pending",
    `${confirmed} de ${rows.length} itens conferidos · ${rows.length - filled} sem valor`,
  );
}

function formatDate(value) {
  if (!value) return "Data a definir";
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.valueOf())
    ? "Data inválida"
    : dateFormat.format(date);
}

function scheduleSummary() {
  const steps = [...document.querySelectorAll("[data-step]")].map((row) => ({
    number: row.dataset.stepNumber,
    title: row.querySelector("h3").textContent,
    date: row.querySelector('input[type="date"]').value,
    owner: row.querySelector('input[id^="owner-"]').value.trim(),
    done: row.querySelector('input[id^="done-"]').checked,
  }));
  const pending = steps.filter((step) => !step.done);
  const next = pending[0];
  if (next) {
    setText("next-meeting-title", `${next.number} · ${next.title}`);
    setText(
      "next-meeting-meta",
      `${formatDate(next.date)} · ${next.owner || "Responsável a definir"}`,
    );
  } else {
    setText("next-meeting-title", "Todas as etapas estão alinhadas");
    setText(
      "next-meeting-meta",
      "Defina uma nova etapa quando houver outro encaminhamento.",
    );
  }
  const list = $("pending-list");
  if (!list) return;
  list.replaceChildren();
  if (!pending.length) {
    const item = document.createElement("li");
    item.textContent = "Nenhuma pendência aberta.";
    list.append(item);
    return;
  }
  pending.forEach((step) => {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    title.textContent = `${step.number} · ${step.title}`;
    const details = document.createElement("span");
    details.textContent = `${formatDate(step.date)} · ${step.owner || "Responsável a definir"}`;
    item.append(title, details);
    list.append(item);
  });
}

function snapshot() {
  const values = {};
  fields.forEach((input) => {
    values[input.id] = input.type === "checkbox" ? input.checked : input.value;
  });
  return {
    project: "castelinho-orcamento",
    version: 1,
    savedAt: new Date().toISOString(),
    selectedMission,
    values,
  };
}

function save(manual = false) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(snapshot()));
    storageHealthy = true;
    const time = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setText("save-status", `Salvo neste navegador · ${time}`);
    setText("budget-save-status", `Planilha salva neste navegador · ${time}`);
    if (manual)
      setText(
        "action-status",
        "Alterações salvas. O envio online será feito sem necessidade de login.",
      );
    window.dispatchEvent(
      new CustomEvent("castelinho:save", { detail: { manual } }),
    );
    return true;
  } catch {
    storageHealthy = false;
    setText(
      "save-status",
      "Não foi possível salvar neste navegador. Tente novamente.",
    );
    setText("budget-save-status", "Não foi possível salvar neste navegador.");
    setText(
      "action-status",
      "O navegador não permitiu o salvamento. Seus campos continuam visíveis nesta tela.",
    );
    window.dispatchEvent(
      new CustomEvent("castelinho:save", { detail: { manual } }),
    );
    return false;
  }
}

function validateSaved(data) {
  if (
    !data ||
    data.project !== "castelinho-orcamento" ||
    data.version !== 1 ||
    !data.values ||
    typeof data.values !== "object" ||
    Array.isArray(data.values)
  ) {
    throw Error("Os dados não são compatíveis com o orçamento do Castelinho.");
  }
  const clean = {};
  fields.forEach((input) => {
    const value = Object.hasOwn(data.values, input.id)
      ? data.values[input.id]
      : input.type === "checkbox"
        ? input.checked
        : input.defaultValue;
    if (input.type === "checkbox") {
      if (typeof value !== "boolean")
        throw Error("Há uma marcação inválida nos dados salvos.");
    } else {
      if (
        typeof value !== "string" ||
        value.length > (input.maxLength > 0 ? input.maxLength : 100)
      )
        throw Error("Há um campo inválido ou muito longo nos dados salvos.");
      if (value && input.type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value))
        throw Error("Há uma data inválida nos dados salvos.");
      if (
        value &&
        input.type === "number" &&
        (!Number.isFinite(Number(value)) || Math.abs(Number(value)) > 1e15)
      )
        throw Error("Há um valor inválido nos dados salvos.");
      if (value && input.type === "url") {
        let url;
        try {
          url = new URL(value);
        } catch {
          throw Error("Há um link inválido nos dados salvos.");
        }
        if (!["http:", "https:"].includes(url.protocol))
          throw Error("Os links devem usar http ou https.");
      }
    }
    clean[input.id] = value;
  });
  const mission =
    Number.isInteger(data.selectedMission) &&
    data.selectedMission >= 0 &&
    data.selectedMission < missions.length
      ? data.selectedMission
      : 0;
  return {
    project: "castelinho-orcamento",
    version: 1,
    selectedMission: mission,
    values: clean,
  };
}

function applySaved(data) {
  const checked = validateSaved(data);
  fields.forEach((input) => {
    if (input.type === "checkbox") input.checked = checked.values[input.id];
    else input.value = checked.values[input.id];
  });
  selectMission(checked.selectedMission);
  budget();
  scheduleSummary();
}

fields.forEach((input) => {
  const update = () => {
    budget();
    scheduleSummary();
    save();
  };
  input.addEventListener("input", update);
  input.addEventListener("change", update);
});

for (const id of ["save-top", "save-bottom", "save-budget"])
  $(id)?.addEventListener("click", () => save(true));
for (const id of ["print", "print-bottom"])
  $(id)?.addEventListener("click", () => window.print());
$("section-nav")?.addEventListener("change", (event) => {
  const target = $(event.target.value);
  if (target) {
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    history.replaceState(null, "", `#${target.id}`);
  }
});

try {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    applySaved(JSON.parse(saved));
    setText("save-status", "Dados salvos restaurados neste navegador");
    setText("budget-save-status", "Planilha restaurada neste navegador.");
  }
} catch {
  setText("save-status", "Não foi possível recuperar a cópia local.");
}

selectMission(selectedMission);
budget();
scheduleSummary();

function preparePrint() {
  document
    .querySelectorAll(".print-value")
    .forEach((element) => element.remove());
  fields.forEach((input) => {
    if (input.type === "checkbox") return;
    const value = document.createElement("div");
    value.className = "print-value";
    value.textContent = input.value || "A definir";
    input.insertAdjacentElement("afterend", value);
  });
}
window.addEventListener("beforeprint", preparePrint);
window.addEventListener("afterprint", () =>
  document
    .querySelectorAll(".print-value")
    .forEach((element) => element.remove()),
);
window.addEventListener("beforeunload", (event) => {
  if (!storageHealthy) {
    event.preventDefault();
    event.returnValue = "";
  }
});
