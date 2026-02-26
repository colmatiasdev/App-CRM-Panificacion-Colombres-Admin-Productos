
# Directivas – Módulo Armador de Productos (Costos y Recetas)

**Uso:** El agente debe leer y aplicar este archivo antes de crear o modificar cualquier parte del módulo ArmadorProductos. Todas las pantallas, flujos y llamadas a API deben alinearse con estas directivas y con el esquema JSON indicado.

---

## 1. Ubicación y estructura de archivos

- **Carpeta del módulo:** `scr/ArmadorProductos/`
- **Patrón por pantalla/módulo:** Una carpeta por módulo con:
  - `[nombre-modulo].html`
  - `[nombre-modulo].css`
  - `[nombre-modulo].js`
  - Si aplica ABM completo: `[nombre-modulo]-crear.html`, `[nombre-modulo]-edit.html` y sus `.js` (mismo patrón que en `scr/administracion/`).
- **Navegación:** Orden y relaciones entre pantallas según `navegacion.ordenMenu` y `navegacion.flujo` del esquema JSON (ver punto 2).

---

## 2. Fuente de verdad (esquema y API)

- **Esquema:** `scr/Arquitectura/esquema-armador-productos.json` (Armador de Productos - Costos y Recetas).
  - Tablas, columnas, PK/FK, relaciones, fórmulas, sumatorias y campos reflejo: tomar siempre de este JSON.
  - Generación de IDs: según `generacionId`. Orden autogenerado: según `ordenAutogenerado`. Listas de valores (combos): según `listasValores` (hoja COMPONENTE-COMBOS). Precisión decimal: según `decimales` en cada columna.
- **API:** Todas las pantallas deben usar `window.APP_CONFIG.appsScriptArmadorProductosUrl` para list, create, update, delete y para cargar listados (ej. COMPONENTE-COMBOS). Nombres de hojas: los `sheetName` del esquema.

---

## 3. Diseño y flujo de pantallas (referencia externa)

- **Repositorio de referencia:** https://github.com/colmatiasdev/App-Toro-Rapido-Dashboard.git  
- **Rama:** `main`  
- **Ruta de referencia:** `scr/administracion/` (diseño HTML, CSS, flujo listado → crear → editar, y estructura de módulos).

**Uso:** Clonar o consultar ese repositorio y usar como referencia la estructura de archivos, el HTML, el CSS y el flujo de sus módulos. Replicar ese estilo y flujo en `scr/ArmadorProductos/`, adaptando:
- Nombres de hojas y columnas a `esquema-armador-productos.json`
- URL de API a `APP_CONFIG.appsScriptArmadorProductosUrl`
- IDs y reglas de negocio al esquema (generacionId, formulas, sumatorias, etc.).

**Insumos (costos) – Tabla-Insumo-Materia-Prima y Tabla-Insumo-Packing:** El diseño y flujo de las pantallas de Materia prima y Packing deben tomarse del repositorio: Repositorio de referencia para Insumos (costos)
- **Repositorio Git público:** [https://github.com/colmatiasdev/App-CRM-Panificacion-Colombres-Admin-Proveedores.git]
- **Rama:** `main`
- **Ruta del módulo dentro del repo:** [scr/costos]
- **Uso:** El agente debe clonar o consultar ese repositorio y usar como referencia exacta la estructura de archivos, el HTML, el CSS y el flujo (listado, crear, editar) de ese módulo para implementar en `scr/ArmadorProductos/` las pantallas correspondientes a **Tabla-Insumo-Materia-Prima** y **Tabla-Insumo-Packing**. Los nombres de hojas (sheetName), la API (Apps Script) y los IDs deben ser los definidos en `esquema-armador-productos.json` y en `config.js` de este proyecto.


---

## 4. Resumen para el agente

| Qué | Dónde / Cómo |
|-----|------------------|
| Carpeta del módulo | `scr/ArmadorProductos/` |
| Esquema (tablas, navegación, IDs, fórmulas) | `scr/Arquitectura/esquema-armador-productos.json` |
| API (Apps Script) | `APP_CONFIG.appsScriptArmadorProductosUrl` en `scr/Configuracion/config.js` |
| Diseño y flujo de pantallas | Repo https://github.com/colmatiasdev/App-Toro-Rapido-Dashboard (rama `main`, `scr/administracion/`) |
| Patrón de archivos | Por módulo: `.html`, `.css`, `.js`; si ABM: `-crear`, `-edit` y sus `.js` |