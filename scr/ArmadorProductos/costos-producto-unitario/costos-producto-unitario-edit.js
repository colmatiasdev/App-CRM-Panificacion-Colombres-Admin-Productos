(function () {
  var SHEET = "Tabla-Costos-ProductoUnitario";
  var SHEET_ELAB = "Tabla-Elaboracion-ProductosBase";

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
    var names = ["IDCosto-ProductoUnitario", "IDElaboracion-ProductoBase", "Comercio-Sucursal", "Nombre-Producto", "Tipo-Producto", "Habilitado"];
    names.forEach(function (name) {
      var el = document.querySelector("[name=\"" + name + "\"]");
      if (!el) return;
      el.value = row[name] != null ? String(row[name]) : "";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var id = getQueryId();
    var loading = document.getElementById("armador-loading");
    var form = document.getElementById("form-cpu");
    if (!id) { loading.textContent = "Falta id en la URL."; return; }
    if (!window.ArmadorAPI) { loading.textContent = "Error: no se cargó la API."; return; }

    var selElab = document.getElementById("IDElaboracion-ProductoBase");
    var selSuc = document.getElementById("Comercio-Sucursal");
    ArmadorAPI.list(SHEET_ELAB).then(function (rows) {
      selElab.innerHTML = "<option value=\"\">—</option>" + rows.map(function (r) {
        var idE = r["IDElaboracion-ProductoBase"] || "";
        return "<option value=\"" + idE + "\">" + idE + "</option>";
      }).join("");
    }).catch(function () {});
    ArmadorAPI.listados("Combo-Comercio-Sucursal").then(function (vals) {
      selSuc.innerHTML = "<option value=\"\">—</option>" + (vals || []).map(function (v) { return "<option value=\"" + v + "\">" + v + "</option>"; }).join("");
    }).catch(function () {});

    ArmadorAPI.list(SHEET)
      .then(function (rows) {
        var row = rows.find(function (r) { return String(r["IDCosto-ProductoUnitario"] || "").trim() === String(id).trim(); });
        loading.style.display = "none";
        if (!row) { showMsg("Registro no encontrado.", "error"); return; }
        form.style.display = "block";
        setFormValues(row);
        if (selElab) selElab.value = row["IDElaboracion-ProductoBase"] || "";
        if (selSuc) selSuc.value = row["Comercio-Sucursal"] || "";
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
        payload["IDCosto-ProductoUnitario"] = id;
        ArmadorAPI.update(SHEET, payload)
          .then(function (res) {
            if (res.result === "error") { showMsg(res.error || "Error al guardar", "error"); return; }
            showMsg("Registro actualizado.", "success");
            setTimeout(function () { window.location.href = "costos-producto-unitario.html"; }, 1200);
          })
          .catch(function (err) { showMsg("Error: " + (err.message || err), "error"); });
      });
    }
  });
})();
