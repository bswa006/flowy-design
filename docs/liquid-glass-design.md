# Liquid Glass‑Inspired Frontend Application Design Guide (2025)

> **Objective**   Provide a single, opinionated, production‑ready reference for designing and building modern web and native‑like interfaces that feel at home in Apple’s new *Liquid Glass* era while remaining framework‑agnostic and brand‑flexible.

---

## 1. Design Philosophy

| Principle               | Rationale                                                                       | In Practice                                                                           |
| ----------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Content First**       | UI chrome should clarify—not compete with—content.                              | Minimise opaque shapes; rely on translucent materials that sample the canvas beneath. |
| **Concentric Geometry** | Relationships are easier to parse when radii and padding share a common centre. | Use radius tokens tied to component height (e.g. `radius = h/2` for capsules).        |
| **Responsive Depth**    | Depth cues create hierarchy without borders.                                    | Float controls on a dedicated *Liquid Glass* plane casting subtle shadows/light.      |
| **Fluid Morphing**      | Interfaces should adapt, not jump, between states.                              | Prefer scale/shape interpolation over opacity toggles.                                |
| **Atomic Tokens**       | One source of truth drives theming, motion and spacing.                         | Expose `--radius‑s`, `--radius‑m`, `--glass‑opacity‑high` tokens to all layers.       |

---

## 2. Material System

### 2.1 Surface Types

| Layer                  | Material                                                  | Typical Usage                        |
| ---------------------- | --------------------------------------------------------- | ------------------------------------ |
| **Base Canvas**        | Solid or live wallpaper                                   | Background imagery, video, blur map. |
| **Content Plane**      | 90% opaque, no blur                                       | Documents, media, data grids.        |
| **Liquid Glass Plane** | 30‑50% opacity, 8‑24 px blur, dynamic specular highlights | Navigation bars, cards, pop‑overs.   |
| **Utility Plane**      | 20‑30% opacity, higher blur, elevated z‑axis              | Alerts, modals, floating widgets.    |

#### Implementation Tokens

```
--glass-blur: 16px;              /* default Gaussian radius */
--glass-opacity: 0.35;           /* RGBA alpha */
--glass-highlight-strength: .7;  /* CSS Lighting‑color mix */
--shadow‑depth‑1: 0 1px 3px rgba(0,0,0,.12);
--shadow‑depth‑2: 0 4px 12px rgba(0,0,0,.16);
```

### 2.2 Light & Dark Adaptive Palettes

* Derive hue from the underlying wallpaper average.
* Guarantee **4.5:1** contrast for primary text & **3:1** for secondary.
* Provide fallback brand tints for static backgrounds.

---

## 3. Geometry & Layout

### 3.1 Radius Scale

```
radius‑xs: 2px   // separators
radius‑s:  6px   // chips
radius‑m:  12px  // buttons, cards
radius‑l:  24px  // sheets, sidebars
radius‑pill: 9999px  // auto‑capsule
```

### 3.2 Spacing Rhythm

```
space‑2:  4px   /* nano */
space‑3:  8px   /* micro */
space‑4: 12px   /* small */
space‑6: 20px   /* medium */
space‑8: 32px   /* large */
```

Use an **8‑point grid**; pad controls with even tokens; avoid odd pixel offsets.

### 3.3 Adaptive Density

| Breakpoint  | Density Profile | Example                                            |
| ----------- | --------------- | -------------------------------------------------- |
| ≤ 480 px    | **Compact**     | iPhone portrait tab bar shrinks to 44 pt height.   |
| 481‑1024 px | **Comfortable** | iPad sidebar 320 pt; cards scale 1.1×.             |
| ≥ 1025 px   | **Spacious**    | Mac Dock 64 pt icons; toolbar gains extra padding. |

---

## 4. Motion System

### 4.1 Timing Functions

| Curve                   | CSS `cubic‑bezier`    | Usage                        |
| ----------------------- | --------------------- | ---------------------------- |
| **Entrance**            | `0.4, 0.0, 0.2, 1`    | Sheets, modals slide‑in.     |
| **Exit**                | `0.4, 0.0, 0.6, 1`    | Pop‑overs dissolve.          |
| **Overshoot (Elastic)** | `0.34, 1.56, 0.64, 1` | Card spring on drag release. |

### 4.2 Duration Scale

```
xs: 90ms   // micro‑feedback
s:  160ms  // tooltip fade
m:  240ms  // navigation transition
l:  500ms  // full‑screen modal
```

### 4.3 Morphing Patterns

1. **Cross‑fade + scale** for image gallery swaps.
2. **Shape interpolation** for capsule→square when expanding cards.
3. **Parallax depth** on scroll: content moves 20 % slower than glass.

---

## 5. Core Components

| Component            | Anatomy                                                               | Key Rules                                                                   |
| -------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Navigation Bar**   | Background (Liquid Glass) + Leading Button + Title + Trailing Actions | Auto‑condense on scroll; opacity ramps from 0‑>1 over 64 px.                |
| **Sidebar / Drawer** | Glass surface + Icon‑Label stack                                      | Supports **compact** icon‑only mode ≤ 600 px.                               |
| **Card**             | Glass container + Thumbnail (optional) + Text                         | Use `radius‑m`; elevation shadow‑depth‑1; responsive width 280‑420 px.      |
| **Button**           | Capsule shape + Label (+ Icon)                                        | Min. touch target 44 × 44 pt; colour inherits brand tint > 60 % saturation. |
| **Modal Sheet**      | Utility Plane glass + Grabber + Content                               | Slide from bottom on mobile, centre‑scale on desktop.                       |
| **Toast**            | Glass chip + Shadow                                                   | Auto‑dismiss 4 s; max width 440 px.                                         |

---

## 6. Accessibility

* Ensure blur surfaces **darken/lighten** by 10 % when *Increase Contrast* is on.
* Provide per‑component `prefers‑reduced‑motion` fallbacks (opacity snap‑on, no scale).
* Respect Dynamic Type / text‑size scaling up to **200 %.**

---

## 7. Performance & Engineering

| Guideline                    | Technique                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| **GPU Blur**                 | Use `backdrop‑filter: blur()` sparingly; cache static glass layers as bitmaps.         |
| **Low‑overhead Reflections** | Fake specular highlight with CSS `radial‑gradient` overlay slaved to pointer position. |
| **Code Split Motion**        | Lazy‑load Framer Motion bundles only for pages needing bespoke animation.              |
| **Tailwind Setup**           | Map tokens to `theme.extend` (e.g. `glass‑blur`, `glass‑opacity`).                     |
| **Shadcn Components**        | Wrap base primitives, adding `.glass` variant classes for each.                        |

---

## 8. Implementation Quick‑Start (React + Tailwind + Framer Motion)

```tsx
// Button.tsx
import { motion } from 'framer-motion';

export function GlassButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="px-space-4 py-space-2 rounded-pill backdrop-blur var(--glass-blur) bg-white/35 shadow-depth-1 hover:bg-white/45 active:scale-95"
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
    >
      {children}
    </motion.button>
  );
}
```

---

## 9. Migration Strategy

1. **Audit** existing UI: list opaque surfaces → target low‑hanging glass wins.
2. **Tokenise** radii, colours, motion; map to Tailwind config.
3. **Incremental rollout**: Start with nav bars & modals, then cards & buttons.
4. **QA** under dark/light, high‑contrast, reduced‑motion, low‑power modes.

---

## 10. Glossary

* **Liquid Glass Plane** – Translucent layer where interactive chrome lives.
* **Concentric Geometry** – Consistent curvature hierarchy aligning nested shapes.
* **Capsule** – Shape whose corner radius equals half its height.
* **Morphing** – Smooth shape/size interpolation preserving perceived mass.

---

> **Crafted June 2025**   Aligns with iOS 26 / macOS Tahoe 26 design language but remains back‑portable. Evolve responsibly; always validate against real devices and diverse user needs.
