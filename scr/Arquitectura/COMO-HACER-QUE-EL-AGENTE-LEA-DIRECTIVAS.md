# Cómo hacer que el agente lea DIRECTIVAS.md

Antes de crear o modificar el módulo ArmadorProductos, el agente debe tomar en consideración las directivas definidas en **scr/Arquitectura/DIRECTIVAS.md**. Este archivo indica cómo lograr que eso ocurra.

---

## Paso 1. Tomar en consideración las directivas en DIRECTIVAS.md

El agente **debe leer y aplicar** el contenido de **scr/Arquitectura/DIRECTIVAS.md** antes de trabajar en ArmadorProductos. Ese archivo define:

- **Ubicación y estructura:** carpeta `scr/ArmadorProductos/`, patrón por módulo (`.html`, `.css`, `.js`; `-crear`, `-edit` si aplica ABM), navegación según el esquema JSON.
- **Fuente de verdad:** esquema en `scr/Arquitectura/esquema-armador-productos.json`, API en `APP_CONFIG.appsScriptArmadorProductosUrl`, generación de IDs, orden autogenerado, listas de valores (COMPONENTE-COMBOS), precisión decimal.
- **Diseño y flujo:** repositorio de referencia (App-Toro-Rapido-Dashboard), estilo y flujo a replicar; para Insumos (Tabla-Insumo-Materia-Prima y Tabla-Insumo-Packing), referencia adicional según DIRECTIVAS.md.

**Sin aplicar primero DIRECTIVAS.md no se debe implementar ni modificar pantallas o lógica de ArmadorProductos.**

---

## Cómo lograr que el agente ejecute el Paso 1

Usá **una** de estas tres formas (o varias a la vez) para que el agente lea y aplique DIRECTIVAS.md:

### Opción A. Mencionar el archivo con @ en cada tarea

Al dar la instrucción, incluí el archivo con `@`:

- **Ejemplo:** *"Creá las pantallas de ArmadorProductos siguiendo @scr/Arquitectura/DIRECTIVAS.md"*
- **Ejemplo:** *"Implementá el listado de Receta base según @scr/Arquitectura/DIRECTIVAS.md"*

Así Cursor incluye el contenido de DIRECTIVAS.md en el contexto y el agente aplica el Paso 1.

### Opción B. Regla de Cursor (recomendado)

Existe la regla en **`.cursor/rules/armador-directivas.mdc`** que indica leer y aplicar DIRECTIVAS.md al trabajar en `scr/ArmadorProductos/`. Si la regla está activa, el agente tenderá a considerar las directivas sin que tengas que mencionarlas en cada mensaje.

### Opción C. Indicarlo en el prompt al iniciar un trabajo

Al empezar un trabajo grande, decí explícitamente:

- *"Leé scr/Arquitectura/DIRECTIVAS.md y a partir de ahí implementá [lo que necesites]."*

---

## Resumen

| Paso / Opción | Descripción |
|---------------|-------------|
| **Paso 1** | Tomar en consideración las directivas en **scr/Arquitectura/DIRECTIVAS.md** antes de cualquier cambio en ArmadorProductos. |
| **Opción A** | Incluir `@scr/Arquitectura/DIRECTIVAS.md` en el mensaje de la tarea. |
| **Opción B** | Usar la regla en `.cursor/rules/armador-directivas.mdc` para que aplique al tocar scr/ArmadorProductos/. |
| **Opción C** | Pedir en el prompt: "Leé DIRECTIVAS.md y luego implementá…". |
