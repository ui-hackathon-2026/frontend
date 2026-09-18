# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

R&D Formulator internal Paragon — kimiawan kosmetik yang merancang, mensimulasikan, dan mengaudit formula produk kosmetik tropis (skincare/personal care) di dalam tim R&D Paragon.

## Product Purpose

Paragon Formulation Studio adalah platform R&D in-silico untuk merancang formula kosmetik dari brief produk hingga batch sheet siap pabrik: menyusun komposisi 4-fase (Formulation Canvas/Workbench), menjalankan optimasi multi-objektif (Pareto/NSGA-II) antara stabilitas, COGS, dan TKDN, mensimulasikan stabilitas fisikokimia, dan mengaudit kepatuhan regulasi sebelum produksi.

## Positioning

Dua pilar yang sama kuat dan terpadu dalam satu alur kerja: (1) simulasi in-silico + penalaran AI multi-tahap (mass balance 100%, simulasi stabilitas 40°C/90 hari, tanpa data hasil yang dihalusinasi), dan (2) kepatuhan regulasi Indonesia terintegrasi (BPOM Perka 17/2022, Halal HAS 23000, TKDN ≥ 40%) — bukan sekadar kalkulator persen bahan.

## Operating Context

- Sebuah **Workspace** (disebut "Project" di backend: `app/models/project.py`) adalah unit kerja R&D per produk/brief — berisi brief, satu atau lebih draft formulasi, versi formula, dan riwayat batch. Dibuat lewat Project Brief Studio (`/project-brief`) atau langsung di editor.
- Sebuah **Formulasi** (disebut "Formula" di backend, `FormulaItemResponse`) adalah komposisi 4-fase (A–D) konkret dengan nama, kategori, batch size, status, dan riwayat versi; selalu terkait ke satu workspace/project via `project_id`, dan bisa dibuat/diedit di dalam Editor Studio (`/editor`) atau Workbench (`/workbench`).
- Alur kerja tim: brief masuk → workspace dibuat → formulator bekerja di editor (multi-draft per workspace) → formula dioptimasi (Pareto) dan diaudit compliance → formula matang menjadi batch sheet.
- Data operasional nyata berasal dari API backend FastAPI (`GET /projects`, `GET /projects/{id}/tree`, formula endpoints); mode mock (`src/data/mock`, `Mock*Repository`) hanya untuk pengembangan/demo.

## Capabilities and Constraints

- Data simulasi, hasil optimasi Pareto, dan status compliance tidak boleh direkayasa/di-fabrikasi di UI produksi — hanya menampilkan data dari repository (mock saat dev, HTTP saat live) yang benar-benar ada.
- Bahasa UI utama adalah Bahasa Indonesia (lihat landing page, brief studio) — pertahankan kecuali diminta lain.
- Autentikasi user sudah ada (`/login`, `/register`, `useAuth`); halaman workspace/formulasi berada di area yang mengasumsikan user sudah login.
- Belum ada halaman navigasi utama untuk daftar workspace atau daftar formulasi lintas-workspace — ini adalah gap yang sedang diisi.

## Product Principles

- Presisi dan kejujuran data di atas segalanya — tidak ada angka simulasi, biaya, atau status compliance yang dikarang.
- Efisiensi kerja formulator: dari brief ke batch sheet dalam satu alur yang terhubung, bukan tools terpisah.
- Kepatuhan regulasi Indonesia (BPOM, Halal, TKDN) adalah bagian bawaan dari proses, bukan langkah tambahan di akhir.
- Enterprise light-mode korporat: bersih, tajam, bebas distraksi (lihat `docs/UI_STANDARDS.md`).
