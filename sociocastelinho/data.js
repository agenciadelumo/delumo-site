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
  var dims = {"antes-01": [480, 640], "antes-02": [480, 640], "antes-03": [640, 480], "antes-04": [480, 640], "antes-05": [480, 640], "antes-06": [480, 640], "antes-07": [480, 640], "antes-08": [480, 640], "antes-09": [480, 640], "antes-10": [480, 640], "antes-11": [480, 640], "antes-12": [640, 480], "durante-01": [480, 640], "durante-02": [640, 480], "durante-03": [480, 640], "durante-04": [480, 640], "durante-05": [480, 640], "durante-06": [640, 480], "durante-07": [480, 640], "durante-08": [480, 640], "durante-09": [482, 640], "durante-10": [480, 640], "durante-11": [480, 640], "durante-12": [482, 640], "durante-13": [480, 640], "durante-14": [480, 640], "registros-01": [360, 640], "registros-02": [360, 640], "registros-03": [360, 640], "registros-04": [360, 640], "registros-05": [360, 640], "registros-06": [360, 640], "registros-07": [360, 640], "registros-08": [360, 640], "registros-09": [480, 640], "registros-10": [480, 640], "registros-11": [360, 640], "historia-01": [640, 480], "historia-02": [640, 480]};
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
        w: (dims[id] || [640, 480])[0],
        h: (dims[id] || [640, 480])[1],
      });
    }
  });
  return { lista: lista, categorias: cat };
})();
