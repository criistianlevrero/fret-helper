# Fret Helper — Alcance del MVP

Visión general (2026-09-23): una app que ayuda a pintar escalas y acordes en el diapasón de la guitarra, con una base de datos de escalas y acordes, que puede identificar acordes a partir del dibujo del usuario sobre el mástil, y que permite relacionar acordes entre sí por distintos tipos de relación.

Este documento se va completando **feature por feature**, a medida que las discutimos. Cada sección queda con: alcance decidido para el MVP, lo que queda afuera (v2+), y preguntas abiertas. La implementación se planifica en una instancia aparte, una vez cerrado el alcance.

## Features candidatas

| # | Feature | Estado |
|---|---|---|
| 1 | Pintar escalas y acordes en el diapasón | 🟡 borrador, a confirmar |
| 2 | Base de datos de escalas y acordes | 🔲 por discutir (comparte modelo con #1, ver abajo) |
| 3 | Identificar acordes a partir del dibujo del usuario | 🔲 por discutir (comparte modelo con #1, ver abajo) |
| 4 | Relacionar acordes y escalas entre sí (tipos de relación a definir) | 🟡 borrador, a confirmar |
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
- **Raíz vs. tonalidad (confirmado)**: la raíz del acorde/escala (ej. el Do de "Do mayor") es intrínseca y va en el modelo de arriba. La tonalidad como *contexto funcional* (ese mismo acorde funcionando como grado V de otra escala) no es un campo fijo — es una relación calculada (ver feature 4), no una que se guarde ni se elija por acorde. Así un mismo acorde puede ser función X de la tonalidad Y y función V de la tonalidad Z al mismo tiempo, sin duplicar datos ni vincular nada a mano.
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

## 4. Relaciones entre acordes y escalas

Extiende el mismo modelo de raíz + fórmula: como una escala y un acorde son la misma cosa a nivel de datos (raíz + conjunto de intervalos, solo cambia si se los usa como `type: 'scale'` o `'chord'`), las reglas de relación se definen **genéricamente entre dos entidades raíz+fórmula**, sin importar si son escala↔escala, acorde↔acorde o acorde↔escala. Eso da gratis cosas como "esta escala contiene a este acorde" (es el mismo cálculo que "este acorde es subconjunto de este otro acorde").

Ninguna relación se guarda como vínculo fijo entre dos entidades del catálogo. Se calculan al vuelo, bajo demanda, corriendo las reglas de abajo contra el catálogo entero (o contra una entidad puntual). "Buscar acordes/escalas relacionados" es entonces: tomar una entidad, correrle todas las reglas contra el resto del catálogo, y devolver los resultados agrupados por tipo de relación — sin elegir tonalidad de antemano.

**Catálogo de reglas — lista inicial (MVP):**

Reglas puramente matemáticas sobre los dos conjuntos de notas, sin curaduría de teoría adicional:

1. **Transposición** — misma fórmula, raíz distinta (C7 ↔ D7).
2. **Modo / rotación** — mismo conjunto de notas, tomando otra nota como raíz. Generaliza "relativa mayor/menor" a cualquier fórmula (la menor natural es el modo eólico de la mayor — un caso particular de esta regla, no hace falta una regla aparte) y también cubre inversiones de acorde (mismas notas, otro bajo).
3. **Subconjunto / superconjunto** — las notas de A están contenidas en B, o viceversa (C ⊂ Cmaj7 ⊂ escala mayor de Do).
4. **Complemento** — cuando A ⊆ B, qué notas le faltan a A para llegar a B (útil para "qué le agrego a este acorde para llegar a tal escala/extensión").
5. **Notas compartidas / similaridad** — cuántas notas tienen en común dos entidades cualesquiera, aunque ninguna sea subconjunto exacto de la otra (sirve para sugerir sustitutos o "cosas que suenan parecido").
6. **Función tonal** — ¿la raíz de A cae en el grado N de alguna escala B del catálogo, y las notas de A matchean (aprox.) el acorde diatónico de ese grado? Se evalúa contra *todas* las escalas del catálogo, no contra una fija, así devuelve varios pares (tonalidad, grado) por entidad.

**Lista extendida (futuro probable, requieren más curaduría teórica o son más específicas):**

- **Paralela con cualidad explícita** — misma raíz, cambia solo la 3ª y/o la 7ª (mayor↔menor, dom7↔m7, etc.) como caso nombrado y con nombre propio, más allá de lo que ya cubre "notas compartidas".
- **Sustitución tritonal** — para dominantes: acorde con raíz a distancia de tritono que comparte 3ª/7ª (invertidas).
- **Dominante secundario / II–V relativo** — relaciones de progresión, no solo de pares (requiere pensar secuencias, no solo relaciones binarias — puede que ni siquiera entre en este sistema de "relaciones entre dos entidades" y termine siendo otra feature).
- **Distancia armónica por círculo de quintas** — qué tan "cerca" están dos raíces en el círculo de quintas, como métrica de afinidad.
- **Sustituciones por tensión** — variantes que comparten función pero agregan/sacan tensiones (V7, V7b9, V7#5) — probablemente un caso más específico de "notas compartidas" con un umbral alto.

**Abierto:**
- Para la regla de "notas compartidas", ¿hace falta un umbral mínimo (ej. al menos 2 notas en común) para que valga la pena mostrarlo como relación, o se muestra todo con su score y se ordena?
- ¿El resultado de "función tonal" se limita a escalas de 7 notas (tonalidades clásicas) o también corre contra escalas de la base en general (pentatónicas, modos, etc.), aunque el concepto de "grado" sea menos estándar ahí?

## 5. Cálculo de digitación (fingers)

Prioridad baja para esta etapa. Idea a futuro: dado un acorde (conjunto de notas activas con su traste/cuerda), calcular qué dedo (`Finger`) le corresponde a cada nota, probablemente con reglas de ergonomía (evitar estiramientos grandes, preferir dedos consecutivos en trastes consecutivos, permitir cejilla con el índice, etc.). Hoy el modelo ya tiene el campo `finger` en `Note` y el componente `Fingers` para mostrarlo, pero nadie lo completa ni hay bug fix del enum (`Finger.none === Finger.thumb === 0`). Se retoma cuando se ataque en detalle.
