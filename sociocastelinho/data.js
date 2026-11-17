// Fotos da apresentação "Associação Amigos do Castelinho" (nov/2026).
window.CASTELINHO_FOTOS = (function () {
  var cat = {
    antes: "Antes da reforma",
    durante: "Estado atual em obra",
    registros: "Registros da obra",
    historia: "Memória",
  };
  var legendas = {
    "antes-01": "Hall de entrada",
    "antes-02": "Interior antes da reforma",
    "antes-03": "Terraço com lambrequins",
    "antes-04": "Espaço interno",
    "antes-05": "Enxergando o antes",
    "durante-01": "Vigamento existente",
    "durante-02": "Estado das madeiras",
    "registros-01": "Fachada com andaimes",
    "registros-09": "Castelinho com tapumes",
    "registros-10": "Fachada do Castelinho",
    "historia-01": "Foto histórica do Castelinho, sede da Comissão de Terras",
    "historia-02": "Registro histórico da região do Castelinho",
  };
  var qtd = { antes: 12, durante: 14, registros: 11, historia: 2 };
  var lista = [];
  Object.keys(qtd).forEach(function (c) {
    for (var i = 1; i <= qtd[c]; i++) {
      var id = c + "-" + (i < 10 ? "0" : "") + i;
      lista.push({
        id: id,
        cat: c,
        catNome: cat[c],
        cap: legendas[id] || cat[c],
        full: "/sociocastelinho/img/obra/" + id + ".webp",
        thumb: "/sociocastelinho/img/thumb/" + id + ".webp",
      });
    }
  });
  return { lista: lista, categorias: cat };
})();
