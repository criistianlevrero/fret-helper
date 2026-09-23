# Fret Helper — Alcance del MVP

Visión general (2026-09-23): una app que ayuda a pintar escalas y acordes en el diapasón de la guitarra, con una base de datos de escalas y acordes, que puede identificar acordes a partir del dibujo del usuario sobre el mástil, y que permite relacionar acordes entre sí por distintos tipos de relación.

Este documento se va completando **feature por feature**, a medida que las discutimos. Cada sección queda con: alcance decidido para el MVP, lo que queda afuera (v2+), y preguntas abiertas. La implementación se planifica en una instancia aparte, una vez cerrado el alcance.

## Features candidatas

| # | Feature | Estado |
|---|---|---|
| 1 | Pintar escalas y acordes en el diapasón | 🔲 por discutir |
| 2 | Base de datos de escalas y acordes | 🔲 por discutir |
| 3 | Identificar acordes a partir del dibujo del usuario | 🔲 por discutir |
| 4 | Relacionar acordes entre sí (tipos de relación a definir) | 🔲 por discutir |
| 5 | Cálculo de digitación (qué dedo toca cada nota de un acorde) | 🔲 documentada, prioridad baja — se retoma más adelante |

---

## 1. Pintar escalas y acordes en el diapasón

*(pendiente de discusión)*

## 2. Base de datos de escalas y acordes

*(pendiente de discusión)*

## 3. Identificación de acordes por dibujo

*(pendiente de discusión)*

## 4. Relaciones entre acordes

*(pendiente de discusión)*

## 5. Cálculo de digitación (fingers)

Prioridad baja para esta etapa. Idea a futuro: dado un acorde (conjunto de notas activas con su traste/cuerda), calcular qué dedo (`Finger`) le corresponde a cada nota, probablemente con reglas de ergonomía (evitar estiramientos grandes, preferir dedos consecutivos en trastes consecutivos, permitir cejilla con el índice, etc.). Hoy el modelo ya tiene el campo `finger` en `Note` y el componente `Fingers` para mostrarlo, pero nadie lo completa ni hay bug fix del enum (`Finger.none === Finger.thumb === 0`). Se retoma cuando se ataque en detalle.
