# Paragon Studio: UI & Development Standards

Dokumen ini mendefinisikan standar resmi pengembangan antarmuka (UI/UX) dan *frontend design system* untuk seluruh modul di platform **Paragon Studio**.

---

## 1. Standar Efek Shimmering pada Seluruh Widget (MANDATORY)

Setiap widget, kartu analitik, panel formulasi, atau kartu status di seluruh modul web **WAJIB** menerapkan efek shimmering. Efek ini memberikan kedalaman visual (*tactile visual depth*), kesan *high-end enterprise*, dan *feedback* interaktif yang konsisten.

### A. Varian Efek Shimmer

| Varian | Class Utility | Props `<ShimmerWidget>` | Kapan Digunakan |
|---|---|---|---|
| **Hover Sweep (Default)** | `.shimmer-card` | `shimmerVariant="hover"` | Digunakan untuk seluruh kartu/widget standar, KPI card, tabel audit, dan modul formulasi. Menampilkan sapuan berkas cahaya lembut saat kursor pengguna berada di atas kartu. |
| **Ambient Sweep** | `.shimmer-ambient` | `shimmerVariant="ambient"` | Digunakan untuk widget dengan status aktif/live, proses simulasi yang sedang berjalan, atau kartu status audit resmi. Berkas cahaya menyapu secara periodik (setiap 6 detik) tanpa menunggu kursor. |
| **Skeleton Loading** | `.shimmer-loading` | `shimmerVariant="loading"` | Digunakan sebagai placeholder saat data analitik/komputasi sedang dimuat secara asinkron. |

### B. Cara Penggunaan dalam Komponen

#### Opsi 1: Menggunakan Komponen Reusable `<ShimmerWidget>` (Direkomendasikan)
```tsx
import { ShimmerWidget } from "@/components/ShimmerWidget";

export const MyAnalyticsWidget = () => {
  return (
    <ShimmerWidget
      shimmerVariant="hover"
      className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs"
    >
      <h3 className="text-sm font-bold text-slate-900">Judul Metrik</h3>
      <p className="text-2xl font-extrabold text-blue-600">98.5%</p>
    </ShimmerWidget>
  );
};
```

#### Opsi 2: Menggunakan Utility Class Tailwind/CSS Langsung
Tambahkan class `.shimmer-card` (atau `.shimmer-ambient`) pada container kartu yang telah memiliki `relative overflow-hidden`:
```tsx
<div className="relative overflow-hidden shimmer-card p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
  {/* Konten Widget */}
</div>
```

### C. Prinsip Performa & Aksesibilitas
- **Non-blocking UI**: Lapisan shimmer menggunakan pseudo-element `::after` dengan `pointer-events: none`, sehingga tombol, input, slider, dan dropdown di dalam widget tetap responsif 100%.
- **Reduced Motion**: Mendukung media query `@media (prefers-reduced-motion: reduce)` secara otomatis untuk pengguna yang sensitif terhadap animasi.

---

## 2. Standar Desain & Estetika Antarmuka (Impeccable Standards)

1. **Light Mode Enterprise Palette**:
   - Primary Brand: Paragon Navy/Deep Blue (`#001299`, `#0a192f`).
   - Background: Pure White (`#ffffff`) atau subtle Slate Tint (`#f8fafc`).
   - Borders: Subtle Slate (`border-slate-200/80` atau `border-slate-100`).
   - Success/Compliance: Emerald (`text-emerald-700`, `bg-emerald-50`, `border-emerald-200`).
2. **Tanpa AI-Slop & Hardware Expose**:
   - Jangan menampilkan badge generik seperti *"LLM Active"*, *"AI Engine Running"*, atau label hardware *"Cloudeka GPU Active"*.
   - Fokus pada fungsionalitas formulasi kosmetik dan sains formulasi.
3. **Optimasi Ruang Vertikal (Above-the-Fold)**:
   - Deskripsi/subtitle panjang digantikan dengan tombol info icon di kanan menggunakan `<DelayedInfoTooltip delayMs={300} />`.
