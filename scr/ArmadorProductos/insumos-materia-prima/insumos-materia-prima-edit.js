(function () {
  var SHEET = "Tabla-Insumo-Materia-Prima";

  function getQueryId() {
    var m = /[?&]id=([^&]+)/.exec(window.location.search);
    if (m) return decodeURIComponent(m[1]);
    var h = (window.location.hash || "").replace(/^#/, "");
    return h ? decodeURIComponent(h) : "";
  }

  function showMsg(text, type) {
    var el = document.getElementById("armador-msg");
    if (!el) return;
    el.textContent = text;
    el.className = "armador-msg " + (type === "error" ? "error" : "success");
    el.style.display = "block";
  }

  function setFormValues(row) {
    var names = ["IDInsumo-MateriaPrima", "Categoria", "Nombre-Producto", "Presentacion-Tipo", "Presentacion-Cantidad-Medida", "Presentacion-Unidad", "Precio-Actual", "Habilitado", "Observaciones"];
    names.forEach(function (name) {
      var el = document.querySelector("[name=\"" + name + "\"]");
      if (!el) return;
      var val = row[name] != null ? row[name] : "";
      if (el.type === "number") el.value = val === "" ? "" : val;
      else el.value = String(val);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var id = getQueryId();
    var loading = document.getElementById("armador-loading");
    var form = document.getElementById("form-materia-prima");

    if (!id) {
      loading.textContent = "Falta id en la URL.";
      return;
    }
    if (!window.ArmadorAPI) {
      loading.textContent = "Error: no se cargó la API.";
      return;
    }

    ArmadorAPI.list(SHEET)
      .then(function (rows) {
        var row = rows.find(function (r) {
          var pk = r["IDInsumo-MateriaPrima"] || r.IDInsumo_MateriaPrima || "";
          return String(pk).trim() === String(id).trim();
        });
        loading.style.display = "none";
        if (!row) {
          showMsg("Registro no encontrado.", "error");
          return;
        }
        form.style.display = "block";
        setFormValues(row);
      })
      .catch(function (err) {
        loading.style.display = "none";
        showMsg("Error al cargar: " + (err.message || err), "error");
      });

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var payload = {};
        fd.forEach(function (value, key) { payload[key] = value; });
        if (payload["Precio-Actual"] !== "") payload["Precio-Actual"] = parseFloat(payload["Precio-Actual"]) || "";
        if (payload["Presentacion-Cantidad-Medida"] !== "") payload["Presentacion-Cantidad-Medida"] = parseFloat(payload["Presentacion-Cantidad-Medida"]) || "";
        payload["IDInsumo-MateriaPrima"] = id;

        ArmadorAPI.update(SHEET, payload)
          .then(function (res) {
            if (res.result === "error") {
              showMsg(res.error || "Error al guardar", "error");
              return;
            }
            showMsg("Registro actualizado.", "success");
            setTimeout(function () { window.location.href = "insumos-materia-prima.html"; }, 1200);
          })
          .catch(function (err) {
            showMsg("Error: " + (err.message || err), "error");
          });
      });
    }
  });
})();
