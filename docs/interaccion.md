# Fret Helper — Interacción y flujos

Borrador iniciado el 2026-09-30. Paso previo al documento de UI y al wireframe: acá se listan **todas las acciones que puede hacer el usuario** y **los flujos** que las encadenan, a partir de `docs/mvp-alcance.md`. No define layout ni componentes visuales (dónde va cada cosa, tabs vs lista, etc.) — eso es del wireframe. Sí define qué se puede hacer, desde qué estado, y qué responde la app.

Se completa igual que el alcance del MVP: sección por sección, a medida que se discute.

**Convenciones:**
- ✅ **Del MVP**: ya decidido en `mvp-alcance.md` (se cita la sección).
- 🟡 **Propuesta**: inferido o sugerido acá, a confirmar.
- ❓ **Abierta**: hace falta decidirlo antes del wireframe.

---

## 1. Objetos con los que interactúa el usuario

| Objeto | Qué es para el usuario | Origen |
|---|---|---|
| **Sesión** | Un "proyecto" con nombre: el conjunto de cosas que armó y quiere recuperar después. | ✅ 1.2 |
| **Entrada** | Un acorde o una escala dentro de la sesión (raíz + fórmula + nombre). | ✅ 1.2 |
| **Posición** | Una forma concreta y tocable de una entrada sobre el mástil. Una entrada puede tener varias. | ✅ 1.1 |
| **Diapasón** | La superficie principal: 6 cuerdas × 27 trastes. Muestra la entrada activa y es donde se dibuja y se eligen posiciones. | ✅ 1 |
| **Catálogo** | Lista curada de fórmulas (escalas y acordes), no editable. Se combina con una raíz para crear una entrada. | ✅ 2 |
| **Sugerencias de reconocimiento** | Lista de nombres candidatos (raíz + fórmula) para lo que el usuario dibujó. | ✅ 3 |
| **Relaciones** | Acordes/escalas vinculados con la entrada activa, agrupados por tipo de relación. | ✅ 4 |
| **Reproductor** | Controles para escuchar una posición (patrón, dirección, velocidad). | ✅ 6 |
| **Preferencias** | Configuración del usuario. Hoy solo el alcance de mano. | ✅ 1.1 |

**Contexto de trabajo** (lo que está "abierto" en cada momento): una sesión activa → una entrada activa dentro de ella → opcionalmente una posición activa dentro de esa entrada. Casi todas las acciones operan sobre este contexto.

---

## 2. Qué puede mostrar el diapasón

Cada casilla puede estar en uno de estos estados visuales:

| Estado | Significado | Origen |
|---|---|---|
| `inactive` | Vacía. | ✅ |
| `root` | Raíz de la estructura activa (calculado, nunca elegido a mano). | ✅ 1 |
| `interval` | Otra nota de la fórmula activa, con su intervalo (calculado). | ✅ 1 |
| `marked` | Nota puesta a mano: dibujo libre o nota de color fuera de la fórmula. | ✅ 1 |
| **Elegida en la posición** | Ocurrencia que forma parte de la posición activa. Tiene que distinguirse de las ocurrencias no elegidas de la misma nota. | 🟡 se deriva de 1.1 |
| **Fuera de alcance** | Nota elegida que excede el alcance de mano configurado (aviso, no bloqueo). | ✅ 1.1 |
| **Sonando** | Nota que se está reproduciendo en este momento. | ❓ ver P-12 |

❓ **Etiqueta de cada nota**: ¿se muestra el nombre (C, E, G), el intervalo (1, 3, 5), o se puede alternar? El POC muestra el nombre. Mostrar el intervalo es muy útil para las escalas.

---

## 3. Inventario de acciones

Formato: **acción** — precondición → resultado.

### A. Sesiones

| # | Acción | Detalle | Origen |
|---|---|---|---|
| A1 | Crear sesión | Pide nombre al crearla (no hay autonombrado). Arranca con… ❓ ¿ninguna entrada, o una entrada vacía lista para dibujar? | ✅ 1.2 |
| A2 | Ver sesiones guardadas | Lista con nombre y `updatedAt`. | 🟡 |
| A3 | Abrir sesión | Carga la sesión como contexto de trabajo. Si la sesión actual tiene cambios sin guardar → ❓ P-5. | ✅ 1.2 |
| A4 | Renombrar sesión | En cualquier momento. | 🟡 |
| A5 | Guardar sesión | Si viene de un guardado: actualiza el mismo registro. Si es nueva: la crea. Nunca pide renombrar. | ✅ 1.2 |
| A6 | Duplicar sesión | Copia completa (entradas + posiciones), se sigue trabajando sobre la copia; el original queda intacto. | ✅ 1.2 |
| A7 | Borrar sesión | Borrado lógico (tombstone). ¿Pide confirmación? | 🟡 el tombstone está en 2; la acción no está listada |

### B. Entradas (dentro de la sesión activa)

| # | Acción | Detalle | Origen |
|---|---|---|---|
| B1 | Agregar entrada desde el catálogo | Ver bloque C. | ✅ 1 |
| B2 | Agregar entrada vacía para dibujar | Diapasón limpio, modo dibujo. Nombre provisional hasta que haya reconocimiento. | ✅ 1 |
| B3 | Cambiar de entrada activa | El diapasón pasa a mostrar la otra entrada. | 🟡 |
| B4 | Renombrar entrada | Mientras se arma, el nombre se sugiere en vivo; una vez guardada queda fijo; siempre editable a mano. | ✅ 1.2 |
| B5 | Guardar entrada | Actualiza si ya existía, crea si es nueva. ❓ P-4: ¿guardar la entrada persiste por sí solo, o solo se persiste al guardar la sesión? | ✅ 1.2 |
| B6 | Duplicar entrada | La copia queda como otra entrada de la misma sesión y pasa a ser la activa. | ✅ 1.2 |
| B7 | Borrar entrada | Tombstone. | 🟡 |
| B8 | Cambiar la raíz de una entrada existente (transponer) | ❓ ¿Se permite, o transponer es crear otra entrada desde Relaciones? ¿Qué pasa con sus posiciones guardadas (se transportan, se descartan)? | ❓ |
| B9 | Cambiar la fórmula de una entrada existente | ❓ Ídem: ¿editable, o se crea una nueva? | ❓ |
| B10 | Reordenar entradas | Probablemente v2. | 🟡 |

### C. Catálogo

| # | Acción | Detalle | Origen |
|---|---|---|---|
| C1 | Buscar por nombre o alias | "m7", "menor 7", "Dórico"… | ✅ 2 |
| C2 | Filtrar escalas / acordes | | 🟡 |
| C3 | Elegir raíz | Las 12 notas. ❓ ¿se elige antes o después de la fórmula? | ✅ 1 |
| C4 | Previsualizar sobre el diapasón antes de confirmar | ❓ útil pero agrega un estado "preview" que no pisa lo actual. | ❓ |
| C5 | Aplicar | Crea una entrada nueva en la sesión y la pinta completa (todas las ocurrencias como root/interval). ❓ P-6: ¿siempre nueva, o puede reemplazar la entrada activa? | ✅ 1 |

### D. Dibujo libre y reconocimiento

| # | Acción | Detalle | Origen |
|---|---|---|---|
| D1 | Marcar una casilla vacía | Queda `marked`. Dispara reconocimiento en vivo. | ✅ 1, 3 |
| D2 | Desmarcar una nota | Click sobre una nota pintada (root/interval/marked) → `inactive`. Vuelve a correr el reconocimiento. | ✅ 1 |
| D3 | Ver sugerencias | Lista ordenada: mejor match primero, desempate por la nota más grave como raíz. Cada una: nombre, tipo (escala/acorde), qué tan bien matchea. | ✅ 3 |
| D4 | Confirmar una sugerencia | Las notas pasan a root/interval; la entrada toma raíz, fórmula, tipo y nombre sugerido. | ✅ 1, 3 |
| D5 | Sin match | No hay sugerencias; el nombre queda como "Acorde personalizado" / lista de notas. ❓ ¿se puede guardar una entrada sin fórmula? | ✅ 3 |
| D6 | Limpiar el diapasón | No está en el MVP, pero borrar nota por nota es tedioso. | 🟡 |
| D7 | Agregar nota de color sobre una estructura ya confirmada | Queda `marked` junto a los root/interval. ❓ P-7: ¿esto vuelve a disparar el reconocimiento (y puede cambiar el nombre, ej. C → Cadd9)? | ✅ 1 |

⚠️ **Conflicto a resolver**: en D2 el click sobre una nota pintada la borra, pero en E2 el click sobre una nota pintada la elige para la posición. El mismo gesto no puede hacer las dos cosas → hace falta distinguir **modos** (ver sección 4).

### E. Posiciones (voicings)

| # | Acción | Detalle | Origen |
|---|---|---|---|
| E1 | Empezar una posición nueva | Sobre el pintado completo de la entrada activa. | ✅ 1.1 |
| E2 | Elegir una ocurrencia | Click → la agrega a la posición. 🟡 Si ya hay una nota elegida en esa cuerda, la reemplaza (regla "como mucho una por cuerda") en vez de dar error. | ✅ 1.1 |
| E3 | Quitar una ocurrencia elegida | Click sobre una ya elegida → se deselecciona. | 🟡 |
| E4 | Ver inversión/voicing detectado | En vivo mientras se elige: "1ra inversión", "Drop 2", etc. | ✅ 1.1 |
| E5 | Ver aviso de alcance | Si las notas (salvo cuerdas al aire) exceden el alcance de mano. Aviso, no bloqueo. | ✅ 1.1 |
| E6 | Guardar posición | Queda anidada bajo la entrada. ❓ ¿Las posiciones tienen nombre? El modelo no lo incluye; ¿alcanza con mostrar el voicing detectado + traste ("1ra inv., traste 5")? | ✅ 1.1 |
| E7 | Cambiar entre posiciones guardadas | Muestra esa posición resaltada sobre el pintado completo. | 🟡 |
| E8 | Editar / duplicar / borrar una posición | Guardar y duplicar están definidos solo para sesión y entrada. | 🟡 |
| E9 | Posición incompleta | ❓ P-2: ¿se puede guardar una posición que no incluye todas las notas de la fórmula? (muy común: omitir la 5ta en acordes de 4 notas). | ❓ |
| E10 | Notas de color en la posición | ❓ ¿una nota `marked` (fuera de la fórmula) puede formar parte de una posición? | ❓ |

⚠️ **Problema con las escalas**: el MVP define "tocable" como *como mucho una nota por cuerda* (1.1). Eso sirve para acordes, pero una posición de escala (ej. un "box" de pentatónica) tiene 2–3 notas por cuerda. Y la reproducción (6) exige una posición, así que con esa regla una escala no se podría escuchar de forma útil. Ver P-1.

### F. Relaciones

| # | Acción | Detalle | Origen |
|---|---|---|---|
| F1 | Ver relaciones de la entrada activa | Resultado agrupado por los 6 tipos de regla. ❓ ¿se calcula siempre en vivo o se pide con un botón? | ✅ 4 |
| F2 | Ver los resultados de un tipo | Ordenados por score, primeras N, con "ver más". | ✅ 4 |
| F3 | Filtrar escalas / acordes en los resultados | | 🟡 |
| F4 | Previsualizar un resultado sobre el diapasón | Superpuesto a la entrada activa, sin reemplazarla (ej. ver dónde cae el acorde dentro de la escala). ❓ P-3. | ❓ |
| F5 | Agregar un resultado a la sesión | Crea una entrada nueva con esa raíz + fórmula. | 🟡 |
| F6 | Ver el complemento | En subconjunto/superconjunto: resaltar las notas que faltan para llegar al otro. | ✅ 4 (regla 4) |
| F7 | Ver función tonal | Lista de pares (escala, grado), ej. "V de Do mayor", "IV de Re mayor". | ✅ 4 (regla 6) |

### G. Reproducción

| # | Acción | Detalle | Origen |
|---|---|---|---|
| G1 | Reproducir | Solo con una posición activa (deshabilitado si no hay, con explicación). | ✅ 6 |
| G2 | Detener | | 🟡 |
| G3 | Elegir patrón | Por cuerda / Salteado. | ✅ 6 |
| G4 | Elegir dirección | Ascendente / Descendente. | ✅ 6 |
| G5 | Ajustar velocidad | Control continuo de "rápido (rasgueo)" a "lento (arpegio)". | ✅ 6 |
| G6 | Repetir en loop | ❓ útil para practicar; no está en el MVP. | ❓ |
| G7 | Reproducir mientras se edita | ❓ ¿cambiar patrón/velocidad durante la reproducción se aplica en vivo o en la próxima? | ❓ |

### H. Preferencias

| # | Acción | Detalle | Origen |
|---|---|---|---|
| H1 | Configurar alcance de mano | Número de trastes. ❓ ¿valor por defecto? (ej. 4) | ✅ 1.1 |
| H2 | Afinación, zurdo, nomenclatura (C/Do), sostenidos/bemoles | No están en el MVP. Se listan para decidir explícitamente que quedan afuera. | ❓ |

### I. Globales

| # | Acción | Detalle | Origen |
|---|---|---|---|
| I1 | Deshacer / rehacer | No está en el MVP. Impacta fuerte la arquitectura del estado — conviene decidirlo ahora. P-8. | ❓ |
| I2 | Indicador de cambios sin guardar | Necesario si el guardado es manual. P-5. | 🟡 |
| I3 | Estado vacío / primer uso | Qué ve alguien que abre la app por primera vez sin sesiones. | 🟡 |

---

## 4. Modos del diapasón

El click sobre una casilla tiene significados distintos según lo que se esté haciendo:

| Modo | Click en casilla vacía | Click en nota pintada | Cuándo se está en este modo |
|---|---|---|---|
| **Editar notas** | Marca (`marked`) | Desmarca (`inactive`) | Dibujo libre, o agregado de notas de color |
| **Elegir posición** | Nada (o ❓ ¿agrega nota de color a la posición?) | Elige / deselecciona esa ocurrencia | Armando o editando una posición |
| **Ver** | Nada | Nada (❓ ¿tocar la nota suena?) | Mirando una posición guardada, reproduciendo, previsualizando relaciones |

🟡 **Propuesta**: modos explícitos con un selector visible (tipo herramientas de un editor: "lápiz" / "seleccionar posición"). La alternativa es inferir el modo del contexto (si hay una posición abierta → elegir; si no → editar), que es más implícita y más fácil de confundir.

---

## 5. Flujos principales

Cada flujo: pasos del usuario → respuesta de la app. Los números entre corchetes son las acciones del inventario.

### Flujo 1 — Primer uso

1. Abre la app sin sesiones guardadas → estado vacío con dos caminos claros: "Buscar un acorde/escala" y "Dibujar en el mástil" [I3].
2. Cualquiera de los dos crea implícitamente una sesión nueva. ❓ Choca con "el nombre se elige al crear la sesión" (1.2): ¿se pide el nombre al arrancar (fricción) o al guardar por primera vez? — P-9.

### Flujo 2 — Del catálogo a una posición que suena

1. Busca "m7" [C1], elige raíz A [C3], aplica [C5] → se crea la entrada "A m7" y se pintan todas las ocurrencias de A, C, E, G.
2. Pasa a elegir posición [E1] → modo "Elegir posición".
3. Clickea una ocurrencia por cuerda [E2] → se resaltan las elegidas; se ve el voicing detectado en vivo [E4] y, si corresponde, el aviso de alcance [E5].
4. Reproduce [G1], ajusta patrón y velocidad [G3–G5].
5. Guarda la posición [E6] → queda listada bajo la entrada.
6. Guarda la sesión [A5].

### Flujo 3 — Dibujar y descubrir qué es

1. Agrega una entrada vacía [B2] → modo "Editar notas".
2. Marca notas [D1] → con cada click se actualiza la lista de sugerencias [D3] y el nombre provisional.
3. Confirma una sugerencia [D4] → las notas pasan a root/interval, se pintan también las demás ocurrencias de la fórmula ❓ (P-10: ¿al confirmar se completa el pintado en todo el mástil, o se quedan solo las notas dibujadas?).
4. Opcional: elige posición (continúa como el Flujo 2 desde el paso 2). ❓ Si ya dibujó exactamente una nota por cuerda, ¿eso se convierte directo en la primera posición?
5. Guarda.

### Flujo 4 — Explorar relaciones

1. Con una entrada activa, abre relaciones [F1].
2. Navega los grupos [F2], ej. "Superconjunto" → aparece "Do mayor (escala)".
3. Previsualiza sobre el diapasón [F4] → ve la escala superpuesta al acorde, con las notas faltantes resaltadas [F6].
4. La agrega a la sesión [F5] → nueva entrada. ❓ ¿Pasa a ser la activa, o se queda en la actual?

### Flujo 5 — Retomar y bifurcar

1. Abre una sesión guardada [A2, A3].
2. Cambia a una entrada [B3], modifica una posición [E8].
3. Guarda → actualiza la misma sesión [A5]; o duplica [A6] → sigue trabajando sobre la copia.

### Flujo 6 — Nota de color

1. Con "C mayor" confirmado, en modo "Editar notas" marca un D [D7].
2. El D queda `marked` junto a C, E, G. ❓ P-7: ¿el nombre sugerido pasa a "Cadd9"? ¿cambia la fórmula de la entrada, o el D queda como extra sin cambiar la fórmula?

---

## 6. Preguntas abiertas para el wireframe

Ordenadas por impacto (las primeras cambian más la estructura de pantallas y del estado):

- **P-1 — Posiciones de escala.** La regla "como mucho una nota por cuerda" no sirve para escalas. ¿Una posición de escala permite varias notas por cuerda dentro de la ventana de alcance? ¿O las escalas no tienen posiciones en el MVP (y entonces no se pueden reproducir)?
- **P-2 — Posiciones incompletas.** ¿Se puede guardar una posición que omite notas de la fórmula?
- **P-3 — Superposición.** ¿El diapasón muestra solo la entrada activa, o se pueden ver dos a la vez (entrada + preview de catálogo/relación, o dos entradas de la sesión)? Define cuántos "estados" visuales necesita cada casilla.
- **P-4 — Unidad de guardado.** ¿Existe "guardar entrada" como acción separada de "guardar sesión"? Con `localStorage` podría ser todo autoguardado y el problema de "guardar vs duplicar" pasa a ser solo "duplicar".
- **P-5 — Cambios sin guardar.** Si el guardado es manual: ¿qué pasa al cambiar de sesión con cambios pendientes? (preguntar / descartar / autoguardar).
- **P-6 — Catálogo sobre entrada activa.** Aplicar desde el catálogo, ¿siempre crea una entrada nueva, o puede reemplazar la actual?
- **P-7 — Notas de color y reconocimiento.** ¿Agregar una nota a una estructura confirmada re-dispara el reconocimiento y puede cambiar su fórmula/nombre?
- **P-8 — Deshacer/rehacer.** ¿Entra en el MVP?
- **P-9 — Nombre de sesión.** ¿Se pide al crear (como dice 1.2) o al primer guardado?
- **P-10 — Qué pasa al confirmar un reconocimiento.** ¿Se completa el pintado en todo el mástil?
- **P-11 — Etiqueta de nota.** Nombre, intervalo, o alternable.
- **P-12 — Feedback de reproducción.** ¿Se resalta en el diapasón la nota que suena?
- **P-13 — Dispositivo objetivo.** ¿Desktop primero, o tiene que funcionar en mobile? Con 27 trastes, cambia la orientación y el layout de todo.

---

## 7. Implicaciones para la arquitectura

Se completa a medida que se cierran las preguntas de arriba. Por ahora, qué decide cada una:

- P-3 → si el diapasón es estado guardado (como hoy: `Note[]` con `status`) o se deriva de las entradas visibles.
- P-4 / P-5 → modelo de persistencia (autoguardado vs guardado manual con estado "sucio").
- Sección 4 → si hace falta una máquina de estados explícita para los modos.
- P-8 → forma de las acciones y del store (historial de estados o de comandos).
- P-12 → sincronización entre el reloj de Web Audio y el render.
- P-13 → layout y posible virtualización del diapasón.
