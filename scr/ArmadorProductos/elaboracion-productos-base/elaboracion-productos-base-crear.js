(function () {
  var SHEET = "Tabla-Elaboracion-ProductosBase";
  var SHEET_RECETAS = "Tabla-Receta-Base";

  function showMsg(text, type) {
    var el = document.getElementById("armador-msg");
    if (!el) return;
    el.textContent = text;
    el.className = "armador-msg " + (type === "error" ? "error" : "success");
    el.style.display = "block";
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("form-elab");
    var sel = document.getElementById("IDReceta-Base");
    if (!window.ArmadorAPI) return;
    ArmadorAPI.list(SHEET_RECETAS).then(function (rows) {
      sel.innerHTML = "<option value=\"\">— Seleccionar receta —</option>" +
        rows.map(function (r) {
          var id = r["IDReceta-Base"] || "";
          var desc = r["Descripcion-Masa-Producto"] || id;
          return "<option value=\"" + id + "\">" + desc + " (" + id + ")</option>";
        }).join("");
    }).catch(function () { sel.innerHTML = "<option value=\"\">Error al cargar recetas</option>"; });

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var fd = new FormData(form);
        var payload = {};
        fd.forEach(function (value, key) { payload[key] = value; });
        if (payload["Cantidad"] !== "") payload["Cantidad"] = parseFloat(payload["Cantidad"]) || "";
        if (payload["Costo-Produccion-ProductoBase"] !== "") payload["Costo-Produccion-ProductoBase"] = parseFloat(payload["Costo-Produccion-ProductoBase"]) || "";
        if (payload["Monto"] !== "") payload["Monto"] = parseFloat(payload["Monto"]) || "";
        ArmadorAPI.create(SHEET, payload)
          .then(function (res) {
            if (res.result === "error") { showMsg(res.error || "Error al guardar", "error"); return; }
            showMsg("Registro creado.", "success");
            setTimeout(function () { window.location.href = "elaboracion-productos-base.html"; }, 1200);
          })
          .catch(function (err) { showMsg("Error: " + (err.message || err), "error"); });
      });
    }
  });
})();
