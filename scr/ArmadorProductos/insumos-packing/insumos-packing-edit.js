(function () {
  var SHEET = "Tabla-Insumo-Packing";

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
    var names = ["IDInsumo-Packing", "Categoria", "Nombre-Producto", "Presentacion-Tipo", "Presentacion-Cantidad-Medida", "Presentacion-Unidad", "Precio-Actual", "Habilitado", "Observaciones"];
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
    var form = document.getElementById("form-packing");

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
          var pk = r["IDInsumo-Packing"] || r.IDInsumo_Packing || "";
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
        payload["IDInsumo-Packing"] = id;

        ArmadorAPI.update(SHEET, payload)
          .then(function (res) {
            if (res.result === "error") {
              showMsg(res.error || "Error al guardar", "error");
              return;
            }
            showMsg("Registro actualizado.", "success");
            setTimeout(function () { window.location.href = "insumos-packing.html"; }, 1200);
          })
          .catch(function (err) {
            showMsg("Error: " + (err.message || err), "error");
          });
      });
    }
  });
})();
