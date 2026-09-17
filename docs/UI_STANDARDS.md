# Paragon Studio: UI & Development Standards

Dokumen ini mendefinisikan standar resmi antarmuka (UI/UX) dan *frontend design system* untuk seluruh modul platform **Paragon Studio**.

---

## 1. Standar Efek Shimmering: HANYA untuk State Loading / Asinkron (MANDATORY)

Efek shimmering (sapuan kilau gradien cahaya) **HANYA** diperbolehkan aktif pada saat **STATUS LOADING / PROSES ASINKRON** (Skeleton Loading, proses inferensi AI, simulasi in-silico yang sedang berjalan, atau pemanggilan data).

> [!IMPORTANT]
> **DILARANG** menggunakan efek shimmer konstan (*ambient loop*) atau sapuan cahaya tak berujung pada widget normal yang sudah selesai dimuat. Ketika data sudah tampil, seluruh widget **WAJIB tampil solid, jernih, tenang, dan bebas distraksi**.

### A. Implementasi Standar Skeleton Shimmer

Setiap modul yang melakukan proses pengambilan data atau komputasi wajib menampilkan placeholder skeleton ber-shimmer yang mencerminkan tata letak kartu aslinya.

| Elemen | Class / Komponen | Keterangan |
|---|---|---|
| **Skeleton Element** | `.shimmer-loading` / `.skeleton-shimmer` | Mengaktifkan sapuan gradien transparan putih-ke-abu secara halus (`1.6s infinite`). |
| **Komponen Reusable** | `<ShimmerSkeleton className="w-full h-8" />` | Komponen siap pakai dari `@/components/ShimmerWidget` untuk membentuk blok skeleton. |
| **Widget Container** | `<ShimmerWidget isLoading={isLoading}>` | Membungkus widget; menampilkan skeleton saat `isLoading = true`, dan menampilkan konten normal saat `isLoading = false`. |

### B. Contoh Penggunaan dalam Komponen

```tsx
import { ShimmerSkeleton } from "@/components/ShimmerWidget";

export const AuditSummaryView = ({ isLoading, data }) => {
  if (isLoading) {
    return (
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <ShimmerSkeleton className="w-48 h-6 rounded-xl" />
          <ShimmerSkeleton className="w-32 h-8 rounded-2xl" />
        </div>
        <div className="grid grid-cols-3 gap-3 pt-2">
          <ShimmerSkeleton className="h-24 rounded-2xl" />
          <ShimmerSkeleton className="h-24 rounded-2xl" />
          <ShimmerSkeleton className="h-24 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
      {/* Konten normal: statis, bersih, tanpa animasi konstan */}
      <h2>{data.title}</h2>
    </div>
  );
};
```

### C. Aksesibilitas (Reduced Motion)
Sistem secara otomatis menghormati `@media (prefers-reduced-motion: reduce)` dengan mematikan animasi sapuan shimmer bagi pengguna yang sensitif terhadap gerakan.

---

## 2. Standar Desain & Visual Enterprise Paragon

1. **Light Mode High-Contrast**:
   - Primary Brand: Paragon Navy/Deep Blue (`#001299`, `#0a192f`).
   - Background: Pure White (`#ffffff`) atau subtle Slate (`#fafbfc` / `#f8fafc`).
   - Border: Crisp Slate borders (`border-slate-200/80` atau `border-slate-100`).
   - Success Status: Emerald (`text-emerald-800`, `bg-emerald-50`, `border-emerald-200`).
2. **Bebas AI-Slop & Hardware Tags**:
   - Jangan menampilkan label hardware atau badge generik seperti *"LLM Engine Active"*, *"Cloudeka GPU Node"*, dll.
   - Fokus murni pada nilai formulasi kosmetika dan sains laboratorium.
3. **Efisiensi Ruang Vertikal**:
   - Subtitle deskriptif panjang diringkas ke dalam tombol info icon di sisi kanan judul menggunakan `<DelayedInfoTooltip delayMs={300} />`.
