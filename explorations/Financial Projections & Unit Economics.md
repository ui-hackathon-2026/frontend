# 📈 Source: Financial Projections & Unit Economics

Dokumen ini memuat model penetapan harga (*pricing model*), kalkulasi *unit economics* per pelanggan, proyeksi laba-rugi (*income statement*) 3 tahun, serta rencana alokasi pendanaan (*fundraising & use of funds*) yang siap diunggah sebagai sumber konteks ke Gemini Notebook.

---

## 1. Model Monetisasi & Struktur Harga B2B SaaS

Model pendapatan berbasis **B2B SaaS Subscription (Tahunan / Annual Contract Value - ACV)** dengan skema *tiered pricing* ditambah layanan implementasi khusus (*Private Tuning*):

```
┌────────────────────────────────────────────────────────────────────────┐
│ 1. ACADEMIC & RESEARCH TIER                                            │
│ Target: Lab Farmasi/Kimia Universitas & Pusat Riset (BRIN)             │
│ Harga: Rp 18.000.000 / tahun (~Rp 1,5 Juta/bulan)                      │
│ Fitur: 3 User Seats, Standard Molecular Screener, Cloud Compute Standar│
└──────────────────────────────────┬─────────────────────────────────────┘
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 2. PROFESSIONAL TIER (PABRIK MAKLON & INDIE BRAND R&D)                 │
│ Target: Pabrik Maklon Kosmetik Skala Menengah, Brand Skincare Aktif    │
│ Harga: Rp 48.000.000 / tahun (~Rp 4 Juta/bulan)                        │
│ Fitur: 10 User Seats, Multi-Objective Optimizer, Halal/TKDN Filters,   │
│        Dedicated Cloud Inference, Export QbD BPOM Report               │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ 3. ENTERPRISE TIER (LARGE FMCG & PHARMA)                               │
│ Target: Korporasi Multinasional / Konglomerasi (ParagonCorp, Kalbe, dll│
│ Harga: Rp 120.000.000 – Rp 250.000.000 / tahun                         │
│ Fitur: Unlimited Seats, Private Fine-Tuned Model (In-House Data),       │
│        LIMS API Integration, On-Premise/VPC Deployment, SLA 99,9%      │
└────────────────────────────────────────────────────────────────────────┘

```

---

## 2. Kalkulasi Unit Economics (Customer Level)

Berdasarkan rata-rata target segmen **Tier Professional (Maklon & Brand R&D)**:

* **Customer Acquisition Cost (CAC):** **Rp 12.500.000**
* *Komponen:* B2B Direct Sales, demonstrasi lab on-site, partisipasi expo kosmetik (Cosmobeauté Indonesia / Beauty Science Fest), dan konten edukasi teknis.


* **Annual Contract Value (ACV / ARPU):** **Rp 48.000.000 / tahun**
* **Customer Lifetime (Rata-rata Retensi):** **3,5 Tahun**
* Software R&D yang terintegrasi dalam alur formulasi memiliki *high switching cost* (tingkat retensi tinggi).


* **Customer Lifetime Value (LTV):**

$$\text{LTV} = \text{ARPU} \times \text{Gross Margin (80\%)} \times 3,5 \text{ Tahun} = \text{Rp 134.400.000}$$


* **Rasio LTV / CAC:**

$$\frac{\text{LTV}}{\text{CAC}} = \frac{\text{Rp 134.400.000}}{\text{Rp 12.500.000}} \approx \mathbf{10,75\times}$$



*(Standar industri B2B SaaS sehat berada di kisaran $>3\times$)*.
* **CAC Payback Period:** **~3,9 Bulan** (biaya akuisisi tertutup dalam kurun waktu kurang dari 4 bulan pertama langganan).

---

## 3. Proyeksi Keuangan 3 Tahun (Financial Projections 2027–2029)

*Asumsi mata uang: Juta Rupiah (IDR Juta)*

| Metrik Keuangan | Tahun 1 (2027) | Tahun 2 (2028) | Tahun 3 (2029) |
| --- | --- | --- | --- |
| **Klien Aktif (Akademik)** | 8 Lab | 20 Lab | 45 Lab |
| **Klien Aktif (Maklon / Pro)** | 12 Maklon | 45 Maklon | 110 Maklon |
| **Klien Aktif (Enterprise)** | 1 Korporasi | 4 Korporasi | 10 Korporasi |
| **Total Pelanggan Aktif** | **21 Klien** | **69 Klien** | **165 Klien** |
|  |  |  |  |
| **Pendapatan SaaS Berulang (ARR)** | Rp 840 Juta | Rp 3.000 Juta | Rp 7.590 Juta |
| **Layanan Implementasi & Tuning** | Rp 150 Juta | Rp 450 Juta | Rp 900 Juta |
| **Total Pendapatan (Gross Revenue)** | **Rp 990 Juta** | **Rp 3.450 Juta** | **Rp 8.490 Juta** |
|  |  |  |  |
| **Beban Pokok Pendapatan (COGS - Cloud/GPU)** | (Rp 180 Juta) | (Rp 520 Juta) | (Rp 1.150 Juta) |
| **Laba Kotor (Gross Profit)** | **Rp 810 Juta (81,8%)** | **Rp 2.930 Juta (84,9%)** | **Rp 7.340 Juta (86,4%)** |
|  |  |  |  |
| **Biaya Operasional (OPEX):** |  |  |  |
| - Gaji Tim Engineering, AI, & Kimia | (Rp 750 Juta) | (Rp 1.600 Juta) | (Rp 2.800 Juta) |
| - Sales, Marketing, & Expo Lab | (Rp 200 Juta) | (Rp 550 Juta) | (Rp 1.100 Juta) |
| - Validasi Lab Basah (*Wet-Lab Testing*) | (Rp 120 Juta) | (Rp 200 Juta) | (Rp 300 Juta) |
| - Administrasi & Legalitas (IP, BPOM Partner) | (Rp 80 Juta) | (Rp 150 Juta) | (Rp 250 Juta) |
| **Total OPEX** | **(Rp 1.150 Juta)** | **(Rp 2.500 Juta)** | **(Rp 4.450 Juta)** |
|  |  |  |  |
| **EBITDA / Net Profit (Sebelum Pajak)** | **(Rp 340 Juta)** | **+Rp 430 Juta** | **+Rp 2.890 Juta** |
| **Net Margin** | *-34,3% (Fase Investasi)* | *+12,5% (Break-even)* | *+34,0% (Skala Komersial)* |

---

## 4. Kebutuhan Pendanaan & Rencana Penggunaan Dana (*Funding Ask & Use of Funds*)

* **Target Pendanaan Tahap Awal (*Pre-Seed / Seed Grant*):** **Rp 800 Juta – 1,2 Miliar**
* **Target Runway:** **18 Bulan Operasional** (hingga mencapai arus kas positif di akhir Tahun ke-2).

```
                      ALOKASI PENGGUNAAN DANA
  ┌──────────────────────────────────────────────────────────────┐
  │ [40%] AI Engineering & Cloud Compute Infrastructure          │
  │       - Server GPU (AWS/GCP A100/H100 instance) & Database   │
  │       - Gaji AI Researcher & Full-Stack Platform Engineer    │
  ├──────────────────────────────────────────────────────────────┤
  │ [25%] Validasi Laboratorium & Mitra Akademik                 │
  │       - Uji lab basah (uji ukuran droplet, PDI, & stabilitas)│
  │       - Benchmarking protokol pengujian formulasi riil       │
  ├──────────────────────────────────────────────────────────────┤
  │ [20%] B2B Sales, Business Development, & Expo                │
  │       - Akuisisi 20+ pabrik maklon & brand pilot             │
  │       - Stan pameran inovasi kosmetik / industri farmasi     │
  ├──────────────────────────────────────────────────────────────┤
  │ [15%] Legal, Hak Kekayaan Intelektual (HAKI), & Operasional  │
  │       - Paten algoritma formulasi, pendaftaran HAKI & legal  │
  └──────────────────────────────────────────────────────────────┘

```