---
version: 1
slug: "src-app-formulation-page-tsx"
primary_target: "src/app/formulation/page.tsx"
related_targets: []
---

## Direction contract

THESIS: The category default for an internal "recent files" surface is a grid of blank file icons. This surface refuses that emptiness: the Workspace card's preview slot dramatizes the workspace's actual formulation state (a real 4-phase composition readout) instead of a generic thumbnail, and the Formulation table dramatizes each formula's mass-balance/status instead of a plain name list.

OWN-WORLD: Inherit Paragon Studio's established light-enterprise system as-is — white / `#fafbfc` grounds, `#001299` / `#0a192f` navy accents, `border-slate-200/80` crisp borders, `rounded-2xl`/`rounded-3xl` cards, emerald status language, Lucide icon set, shimmer active only during loading (never ambient).

STORY: A formulator opens Workspace to find or resume the project (brief + drafts) they are working on for a product. They open Formulation to scan every formula that has been created across all workspaces and jump into the one they need.

FIRST VIEWPORT: Workspace (`/workspace`) — page header, toolbar (search, sort, grid/list toggle, "Workspace Baru"), responsive card grid. Each card: preview slot shows the linked formula's phase A–D composition bars when `ref_formula_id` resolves, else a calm empty-state glyph (never a fake thumbnail); title; mode badge (Baru/Enhance); "Diubah • <relative date>"; owner initials avatar (derived from the logged-in user — API has no per-workspace owner name yet). Formulation (`/formulation`) — page header, filter/search bar (category, status), dense table: name, category, status pill, batch size, mini phase-composition bar, total weight %, updated — sortable, with loading/empty states.

FORM: Structure is brief-pinned, not rolled. Workspace grid follows the user's own Google Drive reference screenshot; Formulation's dense-table form was the user's explicit choice over a matching card grid. Per new-work.md §3, a precisely specified narrow request inside an already-established world is shaped directly — no `concept-seed` tournament, no seed key.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
