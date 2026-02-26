(function () {
  var SHEET = "Tabla-Costos-ProductoUnitario";
  var SHEET_ELAB = "Tabla-Elaboracion-ProductosBase";

  function showMsg(text, type) {
    var el = document.getElementById("armador-msg");
    if (!el) return;
    el.textContent = text;
    el.className = "armador-msg " + (type === "error" ? "error" : "success");
    el.style.display = "block";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("form-cpu");
    if (!window.ArmadorAPI) return;
    var selElab = document.getElementById("IDElaboracion-ProductoBase");
    var selSuc = document.getElementById("Comercio-Sucursal");
    ArmadorAPI.list(SHEET_ELAB).then(function (rows) {
      selElab.innerHTML = "<option value=\"\">— Seleccionar —</option>" +
        rows.map(function (r) {
          var id = r["IDElaboracion-ProductoBase"] || "";
          return "<option value=\"" + id + "\">" + id + "</option>";
        }).join("");
    }).catch(function () { selElab.innerHTML = "<option value=\"\">Error</option>"; });
    ArmadorAPI.listados("Combo-Comercio-Sucursal").then(function (vals) {
      selSuc.innerHTML = "<option value=\"\">—</option>" + (vals || []).map(function (v) { return "<option value=\"" + v + "\">" + v + "</option>"; }).join("");
    }).catch(function () {});

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var payload = {};
        fd.forEach(function (value, key) { payload[key] = value; });
        ArmadorAPI.create(SHEET, payload)
          .then(function (res) {
            if (res.result === "error") { showMsg(res.error || "Error al guardar", "error"); return; }
            showMsg("Registro creado.", "success");
            setTimeout(function () { window.location.href = "costos-producto-unitario.html"; }, 1200);
          })
          .catch(function (err) { showMsg("Error: " + (err.message || err), "error"); });
      });
    }
  });
})();
