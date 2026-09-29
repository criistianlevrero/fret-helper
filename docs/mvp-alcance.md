# Fret Helper — Alcance del MVP

Visión general (actualizado 2026-09-26): un *helper* para guitarristas — no una base de datos estática para consultar, sino una herramienta activa para **encontrar y construir** posiciones de acordes y escalas en el diapasón, combinarlos entre sí, e identificar lo que uno mismo dibuja. Pinta escalas y acordes en el diapasón, tiene una base de datos de escalas y acordes, puede identificar acordes a partir del dibujo del usuario sobre el mástil (incluyendo qué inversión/voicing concreto quedó armado), y permite relacionar acordes y escalas entre sí por distintos tipos de relación libres de tonalidad.

Este documento se va completando **feature por feature**, a medida que las discutimos. Cada sección queda con: alcance decidido para el MVP, lo que queda afuera (v2+), y preguntas abiertas. La implementación se planifica en una instancia aparte, una vez cerrado el alcance.

## Features candidatas

| # | Feature | Estado |
|---|---|---|
| 1 | Pintar escalas y acordes, elegir posiciones/voicings tocables (1.1) y guardarlos en sesiones (1.2) | 🟢 cerrada para MVP |
| 2 | Base de datos de escalas y acordes | 🟢 cerrada para MVP |
| 3 | Identificar acordes a partir del dibujo del usuario (incluye qué inversión/voicing quedó armado) | 🟢 cerrada para MVP |
| 4 | Relacionar acordes y escalas entre sí (tipos de relación a definir) | 🟢 cerrada para MVP |
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
- **Guardado y nombre**: al guardar una entrada de acorde/escala, la app sugiere un nombre automático (salida del reconocimiento — ej. "Do mayor", "Re m7" — o algo genérico si no matchea nada conocido). Detalle completo de la lógica de guardado/nombrado y de la jerarquía de persistencia en 1.2.

### 1.1 Selección de posiciones (voicings) — el corazón del "helper"

Reencuadre clave (confirmado con el usuario): la app no es una base de datos de acordes para consultar, es una herramienta para **encontrar y construir posiciones tocables**. Pintar una fórmula desde la base de datos marca *todas* las ocurrencias de cada nota en las 27 trastes × 6 cuerdas — eso es el punto de partida, no el resultado final. Una **posición** (voicing) es un subconjunto concreto y tocable de esas ocurrencias.

Lo que hace tocable a una posición: como mucho una nota por cuerda, y todas las notas (salvo cuerdas al aire) dentro de una ventana de trastes acotada por el **alcance de mano** del usuario.

La inversión y el tipo de voicing (root position, 1ra/2da/3ra inversión, drop 2, drop 3, etc.) no se eligen de una lista — **se detectan** a partir de qué posición concreta se armó: mirando qué nota de la fórmula quedó más grave (la del bajo) y, para voicings de 4+ notas, comparando el orden de notas resultante contra el orden "cerrado" esperado. El detalle exacto del algoritmo de detección queda para la instancia de implementación; acá solo se fija que es una detección automática, no una entrada manual del usuario.

**Confirmado:**

- **Alcance de mano configurable**: es una preferencia del usuario (no un valor fijo tipo "4 trastes"), porque depende de la destreza y de cuánto se anima a abrir los dedos. Para el MVP, sin sugerencia automática todavía, este valor se usa como validación/aviso mientras se selecciona a mano (ej. avisar si la posición elegida excede el alcance configurado), no como filtro de una lista generada.
- **Alcance del MVP**: selección **manual** de la posición (clickeando sobre el pintado completo cuál ocurrencia de cada nota usar) + detección automática de qué inversión/voicing resultó. La **sugerencia automática** de posiciones posibles (explorar combinaciones válidas y ofrecerlas, tipo "acá tenés 5 formas de tocar esto") queda para una versión futura.
- **Guardado anidado**: una posición guardada es una variante del acorde/escala guardado, no una entidad independiente. Es el tercer nivel de la jerarquía de persistencia (ver 1.2): Sesión → Acorde/Escala → Posición.

**Idea anotada para v2 — selección por "lazo":** herramienta de selección arrastrando sobre el diapasón, además del click nota por nota. Tiene dos usos posibles, que podrían resolverse como una sola herramienta con dos modos o como dos herramientas separadas (a definir en la instancia de implementación):
- **Como atajo de la selección manual**: arrastrar el lazo sobre varias ocurrencias en vez de clickearlas una por una, para llegar al mismo resultado que ya cubre el alcance del MVP de arriba. No cambia el modelo, es puramente una mejora de interacción.
- **Como forma de acotar la sugerencia automática**: trazar el lazo sobre una zona del mástil para que la app explore y ofrezca ahí las posiciones tocables posibles. Le da un mecanismo concreto a la "sugerencia automática" que este documento ya dejaba pateada a v2 — no es una feature nueva, es una forma posible de disparar esa que ya estaba anotada.

### 1.2 Sesiones y jerarquía de guardado

Reencuadre (confirmado con el usuario): no se guardan acordes/escalas sueltos, se guardan **sesiones**. Una sesión es un conjunto de entradas de acorde/escala — relacionadas entre sí o no — que se guarda, se nombra y se recupera como un todo. Es la unidad que el usuario "trae de vuelta".

**Importante — esto es una jerarquía de datos, no un diseño de interfaz.** El usuario la describió en términos de "pestañas" para explicar la idea, pero se documenta deliberadamente sin ese concepto: cómo se presenta (lista, tabs, lo que sea) es una decisión de la instancia de implementación, libre de cualquier supuesto hecho acá.

Jerarquía de tres niveles:

1. **Sesión** — `{ id, name, updatedAt, entradas: Entrada[] }`. El nombre lo elige el usuario desde que la crea, **sin autonombrado** (no hay reconocimiento posible de una colección de acordes potencialmente no relacionados entre sí).
2. **Entrada (acorde o escala)** — `{ id, type, root, formula, name, updatedAt, posiciones: Posición[] }`. Una sesión tiene una o más. Mismo comportamiento de nombre que se había planteado para "guardado" en general, pero aplicado a este nivel: mientras se arma desde cero, el nombre sugerido se recalcula en vivo (igual que el reconocimiento); al guardarse queda fijo (no se recalcula solo); editable a mano en cualquier momento.
3. **Posición (voicing)** — de la sección 1.1, sin cambios: notas concretas por cuerda/traste + inversión/voicing detectada.

**Guardar vs. duplicar, en ambos niveles (sesión y entrada):**
- Guardar sobre algo cargado desde un guardado existente **actualiza ese mismo registro** (mismo `id`, nuevo `updatedAt`) — nunca pide renombrar ni crea uno nuevo por las suyas.
- **Duplicar** bifurca: crea una copia nueva (nuevo `id`) y se sigue trabajando ahí sin tocar el original. A nivel entrada, la copia queda como una entrada más dentro de la misma sesión.
- Arrancar desde cero (sin nada cargado) y guardar siempre crea algo nuevo, porque no hay nada que sobrescribir.
- **Duplicar a nivel sesión (confirmado)**: mismo comportamiento que "guardar como" — bifurca la sesión completa (nuevo `id`, copia de todas sus entradas y posiciones) y se sigue trabajando sobre la copia; el original queda intacto tal cual estaba en el momento de duplicar.

## 2. Base de datos de escalas y acordes

Usa el mismo modelo de raíz + fórmula de intervalos definido en la feature 1 — el catálogo es, en esencia, una lista de fórmulas con nombre (ej. "Mayor" = P1,M2,M3,P4,P5,M6,M7; "m7" = P1,m3,P5,m7), combinables con cualquier raíz para pintar.

**Borrador (a confirmar):**

- **Rango de intervalos (confirmado)**: el enum `Intervals` actual llega a `P8` (una octava). Se extiende con 9na/11na/13na (para acordes extendidos tipo jazz/funk) como valores nominales — importa el nombre para el usuario (`add9` ≠ `sus2` aunque agreguen la misma nota) — pero el cálculo de a qué traste corresponde siempre normaliza a semitonos módulo 12 por debajo.
  - **Simplificación consciente**: el enum no distingue enarmónicos — una 4ta aumentada (Lidio) y una 5ta disminuida (Locrio) caen en el mismo semitono y comparten nombre canónico único. Teóricamente no siempre es el nombre "correcto", pero mantiene el enum chico. Si en algún momento importa mostrar el nombre enarmónico correcto por contexto, es un cambio localizado (agregar el spelling alternativo), no un rediseño.
- **Catálogo vs. guardado del usuario (confirmado)**: dos colecciones separadas. El catálogo de esta feature es contenido curado por la app — fórmulas *sin raíz*, reusables ("Mayor", "m7"). Lo que el usuario guarda (feature 1) es una instancia concreta con raíz ya aplicada y nombre propio; no vuelve automáticamente a aparecer como fórmula reusable del catálogo para MVP (eso queda para v2, como "promover a fórmula propia").
- **Persistencia (confirmado)**: `localStorage` para MVP (sin backend hoy, todo vive en memoria del store y se pierde al refrescar). Se descarta event sourcing para esto — un log de eventos paga cuando hay múltiples editores concurrentes sobre el mismo dato o hace falta auditoría/undo real; acá es un catálogo personal sin edición concurrente. En su lugar, cada entidad guardada lleva `id` + `updatedAt` (o versión) + tombstone de borrado (en vez de borrado físico), lo que alcanza para un sync *last-write-wins* por `id` cuando exista un backend, sin necesitar reconstruir estado reproduciendo un historial de acciones.
- **Alias**: cada fórmula tiene un nombre principal + lista de alias (ej. una misma fórmula puede llamarse "6" o "m7" según cómo se la mire) — necesario para que la búsqueda y el reconocimiento (feature 3) encuentren lo que el usuario espera ante nombres ambiguos.

**Contenido semilla (borrador, a revisar):**

| Escalas | Fórmula |
|---|---|
| Mayor (Jónico) | P1 M2 M3 P4 P5 M6 M7 |
| Menor natural (Eólico) | P1 M2 m3 P4 P5 m6 m7 |
| Menor armónica | P1 M2 m3 P4 P5 m6 M7 |
| Menor melódica | P1 M2 m3 P4 P5 M6 M7 |
| Dórico | P1 M2 m3 P4 P5 M6 m7 |
| Frigio | P1 m2 m3 P4 P5 m6 m7 |
| Lidio | P1 M2 M3 d5 P5 M6 M7 |
| Mixolidio | P1 M2 M3 P4 P5 M6 m7 |
| Locrio | P1 m2 m3 P4 d5 m6 m7 |
| Pentatónica mayor | P1 M2 M3 P5 M6 |
| Pentatónica menor | P1 m3 P4 P5 m7 |
| Blues | P1 m3 P4 d5 P5 m7 |

| Acordes | Fórmula |
|---|---|
| Mayor | P1 M3 P5 |
| Menor | P1 m3 P5 |
| Disminuida | P1 m3 d5 |
| Aumentada | P1 M3 m6 |
| Sus2 | P1 M2 P5 |
| Sus4 | P1 P4 P5 |
| Maj7 | P1 M3 P5 M7 |
| 7 (dominante) | P1 M3 P5 m7 |
| m7 | P1 m3 P5 m7 |
| m7♭5 (semidisminuido) | P1 m3 d5 m7 |
| dim7 | P1 m3 d5 M6 |
| mMaj7 | P1 m3 P5 M7 |
| 6 | P1 M3 P5 M6 |
| m6 | P1 m3 P5 M6 |
| add9 | P1 M3 P5 M9 |

- **Catálogo fijo (confirmado)**: para el MVP el catálogo es contenido curado, no editable desde la UI. Fórmulas propias del usuario quedan para el futuro.

## 3. Identificación de acordes por dibujo

Toma un conjunto de notas `marked` (sin raíz asignada) y busca la mejor raíz + fórmula candidata contra la base de datos de la feature 2, para alimentar la sugerencia de nombre de la feature 1. La búsqueda corre contra **todo el catálogo** (escalas y acordes), no solo acordes — el `type` de la fórmula matcheada define si se etiqueta como "escala" o "acorde". El cálculo de qué tan bien matchea reutiliza la regla de "notas compartidas/subconjunto" de la feature 4: es la misma cuenta, probando cada nota marcada como raíz candidata contra cada fórmula del catálogo.

**Confirmado:**

- **Normalización de entrada**: lo marcado se reduce a un conjunto de notas únicas (clases de altura) antes de comparar contra una fórmula, ignorando en qué cuerda/traste concreto está cada una.
- **La nota de bajo no se ignora**: cuando varias fórmulas matchean igual de bien sobre el mismo conjunto de notas (ambigüedad, ej. C6 vs Am7), se prioriza como raíz la que coincide con la nota más grave de lo marcado — no es una regla dura que descarta las demás opciones, es un criterio de orden entre las sugerencias. Este mismo dato (qué nota quedó de bajo) es el que alimenta la detección de inversión/voicing de la posición elegida (feature 1.1) una vez que el usuario fija una posición concreta: mismo concepto, dos usos — desambiguar el nombre sugerido, y clasificar el voicing resultante.
- **Cuándo corre**: en vivo, cada vez que se agrega una marca (al hacer click). Queda anotado como decisión de interfaz, no de arquitectura: si resulta lento con el catálogo completo, se puede mover detrás de un botón explícito sin cambiar el modelo de cómputo.
- **Sin match**: si nada del catálogo matchea ni parcialmente por encima de un umbral razonable, no se sugiere nombre — vale el fallback ya definido en la feature 1 ("Acorde personalizado" / listar las notas). El umbral exacto se ajusta en la instancia de implementación.

## 4. Relaciones entre acordes y escalas

Extiende el mismo modelo de raíz + fórmula: como una escala y un acorde son la misma cosa a nivel de datos (raíz + conjunto de intervalos, solo cambia si se los usa como `type: 'scale'` o `'chord'`), las reglas de relación se definen **genéricamente entre dos entidades raíz+fórmula**, sin importar si son escala↔escala, acorde↔acorde o acorde↔escala. Eso da gratis cosas como "esta escala contiene a este acorde" (es el mismo cálculo que "este acorde es subconjunto de este otro acorde").

Ninguna relación se guarda como vínculo fijo entre dos entidades del catálogo. Se calculan al vuelo, bajo demanda, corriendo las reglas de abajo contra el catálogo entero (o contra una entidad puntual). "Buscar acordes/escalas relacionados" es entonces: tomar una entidad, correrle todas las reglas contra el resto del catálogo, y devolver los resultados agrupados por tipo de relación — sin elegir tonalidad de antemano.

**Catálogo de reglas — lista inicial (MVP):**

Reglas puramente matemáticas sobre los dos conjuntos de notas, sin curaduría de teoría adicional:

1. **Transposición** — misma fórmula, raíz distinta (C7 ↔ D7).
2. **Modo / rotación** — mismo conjunto de notas, tomando otra nota como raíz. Generaliza "relativa mayor/menor" a cualquier fórmula (la menor natural es el modo eólico de la mayor — un caso particular de esta regla, no hace falta una regla aparte) y también cubre inversiones de acorde (mismas notas, otro bajo).
3. **Subconjunto / superconjunto** — las notas de A están contenidas en B, o viceversa (C ⊂ Cmaj7 ⊂ escala mayor de Do).
4. **Complemento** — cuando A ⊆ B, qué notas le faltan a A para llegar a B (útil para "qué le agrego a este acorde para llegar a tal escala/extensión").
5. **Notas compartidas / similaridad (confirmado)** — score como *proporción* de notas compartidas sobre el tamaño de la fórmula más chica (no un conteo crudo, para que sea comparable entre un acorde de 3 notas y una escala de 7). Sin umbral mínimo fijo: se ordena todo por score descendente y el corte de cuántas se muestran es un límite de interfaz ("primeras N"), no un filtro semántico — el número exacto se ajusta en la instancia de implementación.
6. **Función tonal (confirmado)** — ¿la raíz de A cae en el grado N de alguna escala B del catálogo, y las notas de A matchean (aprox.) el acorde diatónico de ese grado? Corre contra **cualquier escala del catálogo**, no solo las de 7 notas (tonalidades clásicas) — el cálculo no depende de eso. Para pentatónicas u otros modos, el "grado" es simplemente la posición dentro de esa fórmula (1º, 2º, 3º...), aunque no sea la nomenclatura estándar de tonalidad mayor/menor. Se evalúa contra *todas* las escalas del catálogo, no contra una fija, así devuelve varios pares (tonalidad, grado) por entidad.

**Lista extendida (futuro probable, requieren más curaduría teórica o son más específicas):**

- **Paralela con cualidad explícita** — misma raíz, cambia solo la 3ª y/o la 7ª (mayor↔menor, dom7↔m7, etc.) como caso nombrado y con nombre propio, más allá de lo que ya cubre "notas compartidas".
- **Sustitución tritonal** — para dominantes: acorde con raíz a distancia de tritono que comparte 3ª/7ª (invertidas).
- **Dominante secundario / II–V relativo** — relaciones de progresión, no solo de pares (requiere pensar secuencias, no solo relaciones binarias — puede que ni siquiera entre en este sistema de "relaciones entre dos entidades" y termine siendo otra feature).
- **Distancia armónica por círculo de quintas** — qué tan "cerca" están dos raíces en el círculo de quintas, como métrica de afinidad.
- **Sustituciones por tensión** — variantes que comparten función pero agregan/sacan tensiones (V7, V7b9, V7#5) — probablemente un caso más específico de "notas compartidas" con un umbral alto.

## 5. Cálculo de digitación (fingers)

Prioridad baja para esta etapa — documentado para no perder las ideas, se ataca en detalle más adelante.

**Enfoque en dos pasos (anotado, a confirmar cuando se retome):**

1. **Tabla de formas conocidas, indexada por dibujo, no por acorde**: en vez de guardar una digitación por cada combinación de acorde+raíz (redundante, porque una misma forma física se repite transportada a cualquier traste), la tabla se indexa por la **forma geométrica de la Posición** (feature 1.1) — el patrón relativo de traste por cuerda, normalizado respecto del traste más bajo usado, sin importar qué acorde/raíz representa. Así una sola entrada de, por ejemplo, "forma de cejilla mayor" sirve para cualquier acorde mayor tocado con esa forma en cualquier traste: se busca la posición actual contra las formas conocidas y, si matchea, se transporta la digitación guardada.
2. **Función de costo como fallback**: cuando la posición no matchea ninguna forma conocida (voicing armado libremente por el usuario, fuera de catálogo), se calcula la digitación con una búsqueda con función de costo: se generan las asignaciones dedo→nota que cumplen reglas duras (los dedos no se cruzan de traste, salvo cejilla con el índice; un dedo no puede estar en dos trastes distintos a la vez) y se elige la de menor costo según ergonomía (estiramiento total, penalizar dedos débiles en trastes lejanos, premiar cejilla cuando aplica).

**Idea anotada — la misma función de costo podría definir "tocable" (a confirmar, no es una decisión de arquitectura todavía):** hoy 1.1 define que una posición es tocable con un criterio heurístico simple (una nota por cuerda + ventana de alcance de mano configurable), que se mantiene sin cambios para el MVP ya cerrado. La búsqueda con función de costo, al intentar generar una asignación de dedos, ya prueba de forma **exacta** si existe alguna asignación válida — si no hay ninguna, la posición no es tocable, sin depender de un umbral aproximado de trastes. Cuando se ataque esta feature en detalle, esto podría reemplazar o refinar el heurístico de 1.1.

Hoy el modelo ya tiene el campo `finger` en `Note` y el componente `Fingers` para mostrarlo, pero nadie lo completa ni hay bug fix del enum (`Finger.none === Finger.thumb === 0`). Se retoma cuando se ataque en detalle.
