# Directivas paso a paso por página – ArmadorProductos

Este archivo documenta cada pantalla del módulo ArmadorProductos: diseño, flujo y toma de datos del Sheet. **Al modificar diseños o flujos, actualizá este archivo** para que el agente considere los cambios en futuras tareas.

- **Fuente de verdad de datos:** `scr/Arquitectura/esquema-armador-productos.json`
- **API:** `window.APP_CONFIG.appsScriptArmadorProductosUrl` (list, create, update, delete; listados desde COMPONENTE-COMBOS cuando corresponda)
- **Entrada al módulo:** Abrir `scr/ArmadorProductos/armador-dashboard.html` (o enlazar desde la app principal a esa ruta).

---

## 1. Dashboard ArmadorProductos

| Campo | Valor |
|-------|--------|
| **Archivos** | `scr/ArmadorProductos/armador-dashboard.html`, `armador-dashboard.css`, `armador-dashboard.js` |
| **Hoja Sheet** | Ninguna (solo enlaces). |
| **Diseño** | Página de entrada con tarjetas o enlaces por sección (Insumos, Recetas, Elaboración, Productos unitarios, Productos, Listado). Estilo: título "Armador de Productos", grid de accesos. |
| **Flujo** | El usuario elige una sección y navega a la pantalla de listado correspondiente. |
| **Datos** | No consume API. Solo enlaces a los módulos. |
| **Modificaciones** | (Anotar aquí cambios de diseño o nuevos enlaces.) |

---

## 2. Insumos – Materia prima (Tabla-Insumo-Materia-Prima)

| Campo | Valor |
|-------|--------|
| **Archivos** | `scr/ArmadorProductos/insumos-materia-prima/insumos-materia-prima.html`, `.css`, `.js`; `insumos-materia-prima-crear.html` (+ .js), `insumos-materia-prima-edit.html` (+ .js) |
| **Hoja Sheet** | `Tabla-Insumo-Materia-Prima` (sheetName del esquema). |
| **Diseño** | Listado: tabla con columnas según esquema (IDInsumo-MateriaPrima, Categoria, Nombre-Producto, Precio-Actual, Habilitado, etc.). Botones "Nuevo", "Editar" por fila. Crear/Editar: formulario con campos de la tabla; PK autogenerado (prefijo IMP). |
| **Flujo** | Listado → Nuevo → Crear (POST create) → volver a listado. Listado → Editar → Guardar (POST update) → volver a listado. Baja lógica: Habilitado = NO. |
| **Datos** | GET `action=list&sheetName=Tabla-Insumo-Materia-Prima`. POST create/update con payload según columnas. IDs por generacionId (prefijo IMP). |
| **Modificaciones** | |

---

## 3. Insumos – Packing (Tabla-Insumo-Packing)

| Campo | Valor |
|-------|--------|
| **Archivos** | `scr/ArmadorProductos/insumos-packing/insumos-packing.html`, `.css`, `.js`; `insumos-packing-crear.html` (+ .js), `insumos-packing-edit.html` (+ .js) |
| **Hoja Sheet** | `Tabla-Insumo-Packing`. |
| **Diseño** | Igual que Materia prima: listado en tabla, crear/editar en formulario. PK autogenerado (prefijo IP). |
| **Flujo** | Listado → Nuevo / Editar → guardar → listado. Baja lógica vía Habilitado. |
| **Datos** | GET list `sheetName=Tabla-Insumo-Packing`. POST create/update. |
| **Modificaciones** | |

---

## 4. Recetas – Receta base (Tabla-Receta-Base)

| Campo | Valor |
|-------|--------|
| **Archivos** | `scr/ArmadorProductos/receta-base/receta-base.html`, `.css`, `.js`; `receta-base-crear.html`, `receta-base-edit.html`; `receta-base-detalle.html` (listado líneas); `receta-base-detalle-crear.html` (alta de línea). |
| **Hoja Sheet** | `Tabla-Receta-Base`. Detalle: `Tabla-Receta-Base-Detalle` (vinculo IDReceta-Base). |
| **Diseño** | Listado: tabla (IDReceta-Base, Descripcion-Masa-Producto, Costo-Directo-Receta, Rendimiento-Cantidad, etc.). Crear/Editar: formulario con campos de la receta. En edición, sección o enlace a "Detalle receta" (líneas de Tabla-Receta-Base-Detalle). |
| **Flujo** | Listado → Nuevo/Editar receta. Desde edición → "Detalle receta" (listado por IDReceta-Base, alta de ítems con IDInsumo-MateriaPrima, Cantidad, Precio-Equivalencia-x-Unidad, Importe calculado). |
| **Datos** | List: `sheetName=Tabla-Receta-Base`. Detalle: `sheetName=Tabla-Receta-Base-Detalle&idRecetaBase=xxx`. Create/update según esquema. Fórmula Importe = Cantidad * Precio-Equivalencia-x-Unidad (según formulas en esquema). |
| **Modificaciones** | |

---

## 5. Elaboración – Elaboración productos base (Tabla-Elaboracion-ProductosBase)

| Campo | Valor |
|-------|--------|
| **Archivos** | `scr/ArmadorProductos/elaboracion-productos-base/elaboracion-productos-base.html`, `.css`, `.js`; `elaboracion-productos-base-crear.html` (+ .js) |
| **Hoja Sheet** | `Tabla-Elaboracion-ProductosBase`. FK: IDReceta-Base → Tabla-Receta-Base. |
| **Diseño** | Listado: tabla (IDElaboracion-ProductoBase, IDReceta-Base, Cantidad, Costo-Produccion-ProductoBase, Monto). Crear: formulario con selector de IDReceta-Base (desde Tabla-Receta-Base), Cantidad y campos calculados si aplica. |
| **Flujo** | Listado → Nuevo → elegir receta → guardar. Sin edición según abm "listado-alta" (agregar edit si se define después). |
| **Datos** | List: `sheetName=Tabla-Elaboracion-ProductosBase`. Recetas para combo: list de Tabla-Receta-Base. POST create con PK ELAB. |
| **Modificaciones** | |

---

## 6. Productos unitarios – Costos producto unitario (Tabla-Costos-ProductoUnitario)

| Campo | Valor |
|-------|--------|
| **Archivos** | `scr/ArmadorProductos/costos-producto-unitario/costos-producto-unitario.html`, `.css`, `.js`; `-crear`, `-edit`; opcional detalle Relleno y Decoración. |
| **Hoja Sheet** | `Tabla-Costos-ProductoUnitario`. Detalles: Tabla-Receta-Relleno-Detalle, Tabla-Receta-Decoracion-Detalle (vinculo IDCosto-ProductoUnitario). |
| **Diseño** | Listado: tabla (IDCosto-ProductoUnitario, Nombre-Producto, IDElaboracion-ProductoBase, Costo-Elaboracion-Actual, Habilitado, etc.). Crear/Editar: formulario; selector IDElaboracion-ProductoBase. En edición: enlaces o pestañas "Relleno" y "Decoración" (detalles). |
| **Flujo** | Listado → Nuevo/Editar. Desde edición → Relleno (líneas por IDCosto-ProductoUnitario) y Decoración (ídem). Orden autogenerado para Orden. |
| **Datos** | List: `sheetName=Tabla-Costos-ProductoUnitario`. Elaboraciones para combo: list Tabla-Elaboracion-ProductosBase. Comercio-Sucursal: listados COMPONENTE-COMBOS, columna Combo-Comercio-Sucursal. Sumatoria Costo-Relleno-Producto = SUM(Importe) Tabla-Receta-Relleno-Detalle (según sumatorias en esquema). |
| **Modificaciones** | |

---

## 7. Productos – Costo productos (Tabla-Costo-Productos)

| Campo | Valor |
|-------|--------|
| **Archivos** | `scr/ArmadorProductos/costo-productos/costo-productos.html`, `.css`, `.js`; `-crear`, `-edit`; subpáginas o secciones Compuesto producto base, Packing, Packing productos. |
| **Hoja Sheet** | `Tabla-Costo-Productos`. Detalles: Tabla-Costo-Productos-Compuesto-ProductoBase, Tabla-Packing, Tabla-Packing-Detalle, Tabla-Packing-Productos (vinculos por IDCosto-Producto / IDPacking). |
| **Diseño** | Listado: tabla (IDCosto-Producto, Categoria, Producto, Costo-Producto-Maestro-Total, Costo-Packing, Habilitado, etc.). Crear/Editar: formulario; Categoria desde COMPONENTE-COMBOS (Combo-Tipo-Productos). Orden autogenerado. En edición: enlaces a "Compuesto producto base", "Packing", "Packing productos". |
| **Flujo** | Listado → Nuevo/Editar. Desde edición → gestionar ítems compuesto (IDCosto-ProductoUnitario), packings (Tabla-Packing + Tabla-Packing-Detalle), y Tabla-Packing-Productos. |
| **Datos** | List: `sheetName=Tabla-Costo-Productos`. Categoria: listados COMPONENTE-COMBOS, Combo-Tipo-Productos. PK PROD-COSTO. |
| **Modificaciones** | |

---

## 8. Listado – Productos elaborados (Listado-Productos-Elaborados)

| Campo | Valor |
|-------|--------|
| **Archivos** | `scr/ArmadorProductos/listado-productos-elaborados/listado-productos-elaborados.html`, `.css`, `.js`; `-crear`, `-edit` si aplica. |
| **Hoja Sheet** | `Listado-Productos-Elaborados`. |
| **Diseño** | Listado: tabla (Orden-Lista, IDProducto, Comercio-Sucursal, Nombre-Producto, Costo-Producto-Final-Actual, Habilitado). Crear/Editar: formulario; Comercio-Sucursal desde COMPONENTE-COMBOS (Combo-Comercio-Sucursal). Orden-Lista autogenerado. |
| **Flujo** | Listado → Nuevo/Editar → guardar → listado. |
| **Datos** | GET list `sheetName=Listado-Productos-Elaborados`. POST create/update. Listados para combo desde COMPONENTE-COMBOS. |
| **Modificaciones** | |

---

## Resumen de hojas Sheet usadas por pantalla

| Pantalla | sheetName (acción list/create/update) |
|----------|--------------------------------------|
| Materia prima | Tabla-Insumo-Materia-Prima |
| Packing (insumos) | Tabla-Insumo-Packing |
| Receta base | Tabla-Receta-Base |
| Detalle receta | Tabla-Receta-Base-Detalle (filtro idRecetaBase) |
| Elaboración productos base | Tabla-Elaboracion-ProductosBase |
| Costos producto unitario | Tabla-Costos-ProductoUnitario |
| Relleno / Decoración | Tabla-Receta-Relleno-Detalle, Tabla-Receta-Decoracion-Detalle (filtro idCostoProductoUnitario) |
| Costo productos | Tabla-Costo-Productos |
| Compuesto producto base | Tabla-Costo-Productos-Compuesto-ProductoBase (filtro idCostoProducto) |
| Packing (por producto) | Tabla-Packing (filtro idCostoProducto); Tabla-Packing-Detalle (filtro idPacking) |
| Packing productos | Tabla-Packing-Productos (filtro idCostoProducto) |
| Listado productos elaborados | Listado-Productos-Elaborados |
| Combos (listas) | COMPONENTE-COMBOS (columnas Combo-Tipo-Productos, Combo-Comercio-Sucursal) |

---

## Instrucciones para el agente

- Al **crear o modificar** cualquier pantalla de ArmadorProductos, leer **scr/Arquitectura/DIRECTIVAS.md** y este archivo **DIRECTIVAS-PAGINAS.md**.
- Respetar en cada pantalla: hoja Sheet, columnas y PK/FK del esquema; uso de `APP_CONFIG.appsScriptArmadorProductosUrl`; generación de IDs y orden autogenerado según esquema.
- Si el usuario **actualiza** una sección "Modificaciones" o el diseño/flujo en este archivo, aplicar esos cambios en el código correspondiente.
