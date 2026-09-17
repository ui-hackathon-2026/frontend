<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Persistent Developer & Agent Rules (Paragon Studio)

## 1. Mandatory Git Commit & Push Rule
- **Wajib Commit Setiap Kali Mengerjakan Perubahan (Persistent Rule)**:
  - Setiap kali menyelesaikan tugas, perbaikan, fitur, atau modifikasi kode apapun:
    1. Jalankan verifikasi build (`npm run build`).
    2. Langsung lakukan `git add`, `git commit -m "..."` dengan pesan commit yang jelas dan terstruktur (*conventional commits*: `feat`, `fix`, `style`, `refactor`, `perf`, `docs`).
    3. Langsung lakukan `git push origin main`.
  - **DILARANG** meninggalkan perubahan uncommitted di akhir interaksi.

## 2. UI & Design System Standard
- Patuhi standar resmi di `docs/UI_STANDARDS.md`.
- **Shimmering**: HANYA aktif saat status LOADING / proses asinkron (Skeleton Loading via `shimmer-loading` / `<ShimmerSkeleton>`). DILARANG membuat animasi konstan/loop pada widget normal.
- **Light Mode Enterprise**: Estetika murni *light mode* korporat Paragon Studio, kontras tajam, teks terbaca jelas, dan bebas distraksi.
- **Bebas AI-Slop**: Jangan mengekspos badge teknologi/mesin generik ("LLM Active", "Hardware Engine", dll).
- **Efisiensi Vertikal**: Deskripsi panjang dirangkum menggunakan `<DelayedInfoTooltip delayMs={300} />` di kanan judul.

