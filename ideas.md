# ClubConnect Design Brief

## Direction
**Circuit Afterdark** — a focused, premium coding-club interface: near-black navy surfaces, warm amber/orange energy, and a quiet blue-violet glow that reads as technical without feeling gamer-heavy.

## Design movement
Pages move in vertical chapters: a declarative hero, proof through stats, then a practical event catalog. Panels slide a few pixels, never bounce excessively. Motion is a reward for intent, not decoration for its own sake.

## Core principles
- Dark first, high contrast, comfortable density.
- Sharp editorial hierarchy with generous whitespace.
- Amber is reserved for action, status and moments worth noticing.
- Surface treatment stays matte; glow is used sparingly for focus.

## Color philosophy
- Ink `#080a0f`, shell `#0b0e14`, panel `#111720`, raised `#151d28`.
- Accent orange `#f97316`, amber `#fbbf24`, cool cyan `#67e8f9`.
- Primary text `#f8fafc`, muted text `#94a3b8`, borders `rgba(148,163,184,.16)`.

## Layout paradigm
A centered max-width frame with asymmetrical hero copy, responsive two-column feature areas, one featured banner, and mobile cards that keep metadata scannable.

## Signature elements
Bracket/node logo, mono eyebrow labels, hairline section rules, date blocks, event category pills, and code-symbol particles (`{ } </> ; #`) in the hero atmosphere.

## Interaction philosophy
Motion should explain state. Cards lift on hover, lists re-order smoothly, dialogs enter with spring, and destructive actions slow down just enough to make intent legible. All essential content remains available with reduced motion.

## Animation system
GSAP + ScrollTrigger owns hero and scroll effects. Motion (`motion/react`) owns React state transitions and layout. Anime.js owns SVG drawing, particles and loading micro-animations. No element is shared by two motion owners.

## Typography system
Use a clean sans-serif for readable UI and a compact mono face for labels, timestamps, and technical accents. Headings are tight and expressive; body copy is relaxed and limited to readable measure.

## Brand essence and voice
Practical, curious, welcoming, builder-oriented. ClubConnect speaks like a senior peer: direct, optimistic, and specific.

## Wordmark / logo
ClubConnect's mark uses two opposing brackets joined through negative space to suggest collaboration, code syntax and a connected club.

## Signature brand color
ClubConnect Orange `#F97316`.
