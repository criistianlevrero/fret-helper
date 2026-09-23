# Fret Helper — Alcance del MVP

Visión general (2026-09-23): una app que ayuda a pintar escalas y acordes en el diapasón de la guitarra, con una base de datos de escalas y acordes, que puede identificar acordes a partir del dibujo del usuario sobre el mástil, y que permite relacionar acordes entre sí por distintos tipos de relación.

Este documento se va completando **feature por feature**, a medida que las discutimos. Cada sección queda con: alcance decidido para el MVP, lo que queda afuera (v2+), y preguntas abiertas. La implementación se planifica en una instancia aparte, una vez cerrado el alcance.

## Features candidatas

| # | Feature | Estado |
|---|---|---|
| 1 | Pintar escalas y acordes en el diapasón | 🟡 borrador, a confirmar |
| 2 | Base de datos de escalas y acordes | 🔲 por discutir (comparte modelo con #1, ver abajo) |
| 3 | Identificar acordes a partir del dibujo del usuario | 🔲 por discutir (comparte modelo con #1, ver abajo) |
| 4 | Relacionar acordes entre sí (tipos de relación a definir) | 🔲 por discutir |
| 5 | Cálculo de digitación (qué dedo toca cada nota de un acorde) | 🔲 documentada, prioridad baja — se retoma más adelante |

---

## 1. Pintar escalas y acordes en el diapasón

Modelo compartido con las features 2 y 3 (base de datos y reconocimiento): una escala o un acorde se define como **raíz (`root`) + fórmula de intervalos**, porque un intervalo no existe sin una raíz de la que medirse. Esto es lo que se guarda y lo que se compara para buscar/reconocer.

**Borrador (a confirmar):**

- `NoteStatus` deja de elegirse a mano en `root`/`interval`: esos dos estados se calculan automáticamente cuando hay una estructura activa (traída de la base de datos, o confirmada desde una sugerencia de reconocimiento).
- El click manual sobre una casilla vacía siempre produce `marked` — nunca `root`/`interval` directamente. Cubre dos casos con el mismo mecanismo:
  - **Modo libre**: el usuario pinta notas sueltas sin ninguna escala/acorde de base (lo que vos describías como "solo notas sueltas sin relación").
  - **Agregado sobre una estructura**: una nota de color que no pertenece a la fórmula de lo ya pintado.
- Click sobre una nota ya pintada (root/interval/marked) la vuelve a `inactive`.
- **Raíz vs. tonalidad**: la raíz del acorde/escala (ej. el Do de "Do mayor") es intrínseca y va en el modelo de arriba. La tonalidad como *contexto funcional* (ese mismo acorde funcionando como grado V de otra escala) no es un campo fijo — es una relación (ver feature 4), porque el mismo acorde puede tener varias funciones según el contexto y no queremos duplicar el dato. **Pendiente de confirmar con el usuario** si esto cubre lo que pedía o si "tonalidad" apuntaba a otra cosa (ej. una tonalidad general de sesión/proyecto).
- Dos caminos para llegar a un diapasón pintado, que conviven entre sí:
  - **Desde la base de datos**: se elige una escala/acorde del catálogo → se pintan automáticamente sus notas como root/interval.
  - **A mano / dibujando**: se clickean notas sueltas (quedan `marked`) → dispara reconocimiento (feature 3) → la app sugiere raíz + nombre(s) candidatos → al confirmar uno, esas notas pasan a root/interval.
- **Guardado y nombre**: al guardar, la app sugiere un nombre automático (salida del reconocimiento — ej. "Do mayor", "Re m7" — o algo genérico si no matchea nada conocido) y el usuario lo puede editar, antes o después de guardar. Reutiliza `FretboardConfig` (`id`, `title`, hoy sin uso), que habría que extender con algo como `root`, `formula`, `type`.

**Abierto:**
- ¿Qué pasa si el conjunto pintado matchea varios nombres posibles (ambigüedad, ej. mismas notas = C6 y Am7)? ¿Se muestran varias sugerencias o se elige una por defecto?
- ¿El nombre autogenerado se recalcula si se sigue clickeando después de guardar, o queda fijo una vez que el usuario le puso nombre propio?
- ¿"Guardar" siempre crea algo nuevo, o también se puede sobrescribir/editar algo ya guardado?

## 2. Base de datos de escalas y acordes

Usa el mismo modelo de raíz + fórmula de intervalos definido en la feature 1 — el catálogo es, en esencia, una lista de fórmulas con nombre (ej. "mayor" = P1,M2,M3,P4,P5,M6,M7; "m7" = P1,m3,P5,m7), combinables con cualquier raíz para pintar. Resto del alcance: *(pendiente de discusión)*.

## 3. Identificación de acordes por dibujo

Toma un conjunto de notas `marked` (sin raíz asignada) y busca la mejor raíz + fórmula candidata contra la base de datos de la feature 2, para alimentar la sugerencia de nombre de la feature 1. Resto del alcance (cómo se decide la raíz cuando hay ambigüedad, qué pasa si no matchea nada): *(pendiente de discusión)*.

## 4. Relaciones entre acordes

*(pendiente de discusión)*

## 5. Cálculo de digitación (fingers)

Prioridad baja para esta etapa. Idea a futuro: dado un acorde (conjunto de notas activas con su traste/cuerda), calcular qué dedo (`Finger`) le corresponde a cada nota, probablemente con reglas de ergonomía (evitar estiramientos grandes, preferir dedos consecutivos en trastes consecutivos, permitir cejilla con el índice, etc.). Hoy el modelo ya tiene el campo `finger` en `Note` y el componente `Fingers` para mostrarlo, pero nadie lo completa ni hay bug fix del enum (`Finger.none === Finger.thumb === 0`). Se retoma cuando se ataque en detalle.
