# Fret Helper — Estado actual del código

Documento de referencia del estado del proyecto al 2026-09-23. Describe lo que existe hoy, cómo está armado y qué problemas conocidos tiene. No describe el rumbo futuro (ver `docs/mvp-alcance.md` para eso).

## Qué es hoy

Una app React que dibuja un diapasón de guitarra (6 cuerdas × 27 trastes) y permite hacer click en cada nota para rotar su estado (`inactive → root → interval → marked → ...`). Es un POC: no hay todavía escalas, acordes, reconocimiento ni persistencia.

## Stack

- **React 18** + **TypeScript** (modo `strict`), compilado con **Vite 4**.
- **Redux** clásico (`createStore` + `combineReducers`) para el estado global.
- **typesafe-actions** para tipar acciones/reducers de forma segura.
- **redux-observable** para efectos secundarios vía *epics* (hoy no hay ningún epic real, ver más abajo).
- **Tailwind CSS** + **DaisyUI** para estilos; también hay CSS Modules puntuales (`*.module.css`) para el grid del diapasón y las notas.
- `react-router-redux` está como dependencia y aparece en el store (`router` key, `routerActions`), pero **no hay ningún router montado** en `App.tsx`. Es código muerto heredado de un boilerplate.

## Estructura de carpetas

```
src/
├── App.tsx                        # monta <Provider> + AppShell + Fretboard
├── components/
│   ├── shell/                     # layout: AppShell (wrapper) + MainMenu (botón "menu", sin funcionalidad)
│   └── fretboard/                 # feature principal
│       ├── models.ts              # tipos de dominio (Note, Finger, NoteStatus, NoteNames, Intervals)
│       ├── services/
│       │   └── fretboard.service.ts   # genera las notas del diapasón a partir de un tuning MIDI
│       ├── store/                 # actions/reducer/selectors del fretboard (typesafe-actions)
│       └── components/
│           ├── fretboard/         # Fretboard (contenedor conectado) + FretboardViewport (grid visual)
│           ├── note/              # Note: una celda del diapasón, clickable
│           └── tools/             # overlays por nota: ToolDispatcher, Fingers, Scales
├── services/                      # capa de "servicios" inyectados a los epics (services.api.*)
└── store/                         # root store: root-reducer, root-epic, root-action, tipos de typesafe-actions
```

## Modelo de dominio (`fretboard/models.ts`)

- `NoteNames`: las 12 notas cromáticas (`C`, `C#`, `D`, ... `B`).
- `NoteStatus`: `inactive | root | interval | marked` — estado visual/funcional de una nota en el diapasón.
- `Intervals`: intervalos musicales de `P1` a `P8` (unísono a octava), sin usarse todavía en ningún lado.
- `Finger`: `none | thumb(0) | index(1) | middle(2) | ring(3) | little(4)` — qué dedo toca una nota.
- `Note`: `{ name, status, pitch?, interval?, finger? }` — una celda del diapasón.
- `FretboardConfig`: `{ id, title, category? }` — pensado para guardar/nombrar un diapasón, no se usa todavía (el reducer lo inicializa como `{id: "new", title: "New fretboard"}` y no cambia nunca).

## Cómo se genera el diapasón (`fretboard.service.ts`)

`getFretboard()` arma un array plano de `Note` para 6 cuerdas × 27 trastes, a partir de:
- `tuning = [64, 59, 55, 50, 45, 40]` (afinación estándar en números MIDI, de la 1ª a la 6ª cuerda).
- Para cada cuerda, itera 27 trastes y calcula la nota cromática con `(traste + afinación - offset) % 12`.
- Devuelve todas las notas en `NoteStatus.inactive` salvo que el reducer las haya cambiado.

Esto se usa como **estado inicial** del reducer de fretboard (`getFretboard()` corre una sola vez al importar el módulo). No hay forma hoy de cambiar la afinación, la cantidad de trastes/cuerdas, ni de "resetear" el diapasón desde la UI.

## Flujo de datos / Redux

- `store/root-reducer.ts` combina `router` (muerto), `fretboard`.
- `fretboard/store/reducer.ts` tiene dos sub-reducers combinados: `fretboard` (el array de `Note[]`) y `fretboardConfig` (no usado).
- Única acción hoy: `changeNoteStatus(noteIndex, status)` — al hacer click en una nota (`Note.tsx`), rota su `status` al siguiente valor del enum `NoteStatus`.
- `store/root-epic.ts` combina los epics de todas las features. Hoy está vacío (ver "Qué se eliminó").
- `store/index.ts` arma el store con `redux-observable` middleware + Redux DevTools (si está disponible).

## Componentes de UI

- **`AppShell`**: wrapper con `MainMenu` (un botón "menu" sin acción) + children.
- **`Fretboard`** (conectado a Redux): lee `state.fretboard.fretboard` vía selector y renderiza un `<Note>` por cada una dentro de `FretboardViewport`. También tiene un botón "log" que solo hace `console.log`, resabio de debug.
- **`FretboardViewport`**: el grid visual (CSS Modules), sin lógica.
- **`Note`** (conectado a Redux): una celda; al click, dispara `changeNoteStatus`. Envuelve su contenido en `ToolDispatcher`.
- **`ToolDispatcher`**: layout de 3 columnas por nota — `Scales` (stub vacío) | nombre de la nota | `Fingers`.
- **`Fingers`**: dibuja un ícono SVG de dedo con un número adentro. Hoy **siempre muestra "0"** porque ninguna nota tiene `finger` asignado (`noteModel.finger ?? Finger.none`) y además `Finger.none` y `Finger.thumb` comparten el valor `0` en el enum, así que ni siquiera se puede distinguir "sin dedo asignado" de "pulgar". Es el bug de base a resolver cuando se ataque el cálculo de digitación.
- **`Scales`**: componente vacío, sin contenido. Placeholder para lo que hoy se llama la feature de "pintar escalas".

## Qué se eliminó en esta sesión

- **`src/components/todos/`** completo (componentes, store, tipos) y **`src/services/todos-api-client.ts`**: era una mini-app de ejemplo tipo TODO (CRUD con epics) sin relación con el propósito del proyecto — resabio de un boilerplate de `typesafe-actions`. Se sacó también su referencia en `App.tsx`, `store/root-reducer.ts`, `store/root-epic.ts` y `services/index.ts`.
- Se verificó que la app sigue renderizando igual (mismo header, mismo grid de diapasón) y sin errores de consola tras el borrado.

## Problemas conocidos (no corregidos aún, fuera de alcance de esta sesión)

1. **`npm run build` falla** (`tsc && vite build`) porque `tsc --noEmit` tira errores:
   - `'FretboardModels'` es un alias de módulo usado en 4 archivos (`fretboard.tsx`, `tools/index.tsx`, `scales.tsx`, `store/reducer.ts`) que nunca se configuró ni en `tsconfig.json` ni en `vite.config.ts` (falta un `paths`/`alias`). Resabio de un generador/scaffold de `typesafe-actions` que asumía ese alias.
   - `store/actions.ts` importa `NoteStatus` desde `fretboard.service.ts`, que no lo exporta (el enum vive en `models.ts`).
   - Falta `@types/node` (uso de `process.env` en `store/utils.ts`) y falta tipar el `Promise<void>` de `saveSnapshot` (ya eliminado junto con todos).
   - **Nota importante**: `vite build`/`vite dev` sí funcionan hoy pese a estos errores, porque esbuild elimina los imports que solo se usan como tipo (no hay uso real en runtime de `FretboardModels`/`NoteStatus` como valor). O sea: la app corre, pero el type-check está roto. Conviene arreglarlo antes de sumar código nuevo para no acumular más deuda de tipos.
2. **`react-router-redux`** está enganchado en el store (`router` reducer/actions) pero no hay ningún `<Router>` montado ni rutas definidas. Código muerto, candidato a remover cuando se defina si el MVP necesita routing (ej. para distintas vistas de escalas/acordes guardados).
3. **`FretboardConfig`** (id/title/category de un diapasón) existe en el modelo y el reducer pero no se usa en ningún lado — probablemente el germen de "guardar/nombrar" una escala o acorde pintado, a definir en el MVP.
4. Sin tests (no hay test runner configurado ni archivos de test).
5. `Fingers` (ver arriba): bug del enum `Finger` y falta de asignación de dedos — documentado para retomar más adelante, no se toca ahora.
6. Mezcla de lockfiles: hay `package-lock.json` (npm) y `yarn.lock` (yarn) al mismo tiempo. Conviene elegir uno solo cuando se retome el proyecto.
