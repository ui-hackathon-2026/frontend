import { IOptimizerRepository } from "@/domain/repositories/IOptimizerRepository";
import {
  ParetoOptimizationParams,
  ParetoOptimizationResult,
  ParetoTrialPoint,
  ParetoCandidateFormula,
} from "@/domain/models/optimizer";

export class MockOptimizerRepository implements IOptimizerRepository {
  async runOptimization(
    params: ParetoOptimizationParams
  ): Promise<ParetoOptimizationResult> {
    // Simulate GPU accelerated Optuna NSGA-II computation time (1.2s)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Generate ~100 realistic trial points forming a Pareto curve
    const points: ParetoTrialPoint[] = [];

    // 1. Pareto Frontier Boundary Points (Non-dominated rank 1)
    // Trade-off: Higher stability generally requires better emulsifiers/actives, which cost more
    const frontierSteps = 25;
    for (let i = 0; i < frontierSteps; i++) {
      const t = i / (frontierSteps - 1); // 0 (cheapest) to 1 (highest stability)
      const stability = 85.0 + t * 11.5 + (Math.sin(i * 1.5) * 0.4); // 85% to ~96.5%
      const cogs = 22000 + Math.pow(t, 1.4) * 32000 + (Math.cos(i * 2) * 600); // Rp 22.000 to Rp 54.000
      const tkdn = 40.0 + (1 - t * 0.4) * 20.0 + (Math.sin(i * 3) * 3); // 40% to ~60%
      const visc = params.constraints.targetViscosityMpaS + (Math.sin(i * 2.5) * 250);

      points.push({
        id: `frontier-${i + 1}`,
        trialIndex: (i + 1) * 2000,
        stabilityPct: parseFloat(stability.toFixed(1)),
        cogsIdr: Math.round(cogs / 100) * 100,
        tkdnPct: parseFloat(tkdn.toFixed(1)),
        viscosityMpaS: Math.round(visc),
        isParetoOptimal: true,
        rank: 1,
      });
    }

    // 2. Dominated Internal Trials (~75 points below the frontier)
    for (let j = 0; j < 75; j++) {
      const randT = Math.random();
      const frontierCogs = 22000 + Math.pow(randT, 1.4) * 32000;
      const frontierStability = 85.0 + randT * 11.5;

      // Suboptimal points have higher COGS or lower stability
      const penaltyStability = frontierStability - (2.5 + Math.random() * 8.5);
      const penaltyCogs = frontierCogs + (1500 + Math.random() * 12000);
      const tkdn = 34.0 + Math.random() * 22;
      const visc = params.constraints.targetViscosityMpaS + (Math.random() * 900 - 450);

      points.push({
        id: `trial-dom-${j + 1}`,
        trialIndex: Math.floor(Math.random() * 49000) + 1,
        stabilityPct: parseFloat(Math.max(72.0, penaltyStability).toFixed(1)),
        cogsIdr: Math.round(penaltyCogs / 100) * 100,
        tkdnPct: parseFloat(tkdn.toFixed(1)),
        viscosityMpaS: Math.round(visc),
        isParetoOptimal: false,
        rank: 2 + Math.floor(Math.random() * 4),
      });
    }

    // 3. Define the Top-3 Curated Candidates on the frontier
    const candidateA: ParetoCandidateFormula = {
      id: "A",
      title: "Kandidat A: The Balanced Sweet Spot",
      archetype: "Kompromi Optimal Stabilitas & Biaya",
      badgeLabel: "Rekomendasi Utama",
      metrics: {
        stabilityPct: 92.4,
        cogsIdrPerKg: 38500,
        tkdnPct: 48.5,
        viscosityMpaS: 5250,
        systemHlb: 10.8,
      },
      tradeOffSummary:
        "Keseimbangan optimal antara probabilitas stabilitas 40°C tinggi (92,4%) dan biaya bahan terkendali (Rp 38.500/kg) dengan pemenuhan TKDN melampaui standar.",
      physicochemicalRationale:
        "Sistem emulgator non-ionik ganda (Cetearyl Glucoside & Sorbitan Olivate) membentuk kristal cair pipih lamellar gel network yang mengunci droplet emulsi O/W secara termodinamika.",
      ingredients: [
        {
          id: "ing-a1",
          name: "Aqua Demineralisata",
          inci: "Water",
          phase: "A",
          weightPct: 64.5,
          functionDesc: "Pelarut Elektrolit & Fase Kontinu",
          isLocalTkdn: true,
        },
        {
          id: "ing-a2",
          name: "Glycerin (Vegetable USP 99.5%)",
          inci: "Glycerin",
          phase: "B",
          weightPct: 4.5,
          functionDesc: "Humektan Penahan Kelembapan Stratum Corneum",
          isLocalTkdn: true,
        },
        {
          id: "ing-a3",
          name: "Virgin Coconut Oil Terfraksi (Riau)",
          inci: "Caprylic/Capric Triglyceride",
          phase: "A",
          weightPct: 8.0,
          functionDesc: "Emolien Lipid Non-comedogenic Ringan",
          isLocalTkdn: true,
        },
        {
          id: "ing-a4",
          name: "Squalane (Olive Phytosqualane)",
          inci: "Squalane",
          phase: "A",
          weightPct: 4.5,
          functionDesc: "Kompatibilitas Biomimetik Sebum Alami",
        },
        {
          id: "ing-a5",
          name: "Cetearyl Glucoside & Sorbitan Olivate",
          inci: "Cetearyl Glucoside",
          phase: "C",
          weightPct: 3.5,
          functionDesc: "Pengemulsi Non-ionik Lamellar Gel Network",
        },
        {
          id: "ing-a6",
          name: "Ekstrak Centella Asiatica (Garut)",
          inci: "Centella Asiatica Extract",
          phase: "D",
          weightPct: 2.5,
          functionDesc: "Bahan Aktif Penenang Barrier Kulit",
          isLocalTkdn: true,
        },
        {
          id: "ing-a7",
          name: "Niacinamide USP (Vitamin B3)",
          inci: "Niacinamide",
          phase: "D",
          weightPct: 2.0,
          functionDesc: "Bahan Aktif Pencerah & Kontrol Sebum",
        },
        {
          id: "ing-a8",
          name: "Polyacrylate Crosspolymer-6",
          inci: "Polyacrylate Crosspolymer-6",
          phase: "B",
          weightPct: 0.6,
          functionDesc: "Modifier Reologi Stabil Rentang Elektrolit Luas",
        },
        {
          id: "ing-a9",
          name: "Sodium Hyaluronate (Multi-Molecular)",
          inci: "Sodium Hyaluronate",
          phase: "D",
          weightPct: 0.5,
          functionDesc: "Hidrasi Antar-Lapisan Kulit",
        },
        {
          id: "ing-a10",
          name: "Phenoxyethanol & Ethylhexylglycerin",
          inci: "Phenoxyethanol",
          phase: "D",
          weightPct: 0.9,
          functionDesc: "Pengawet Spektrum Luas Sesuai Perka BPOM 17/2022",
        },
        {
          id: "ing-a11",
          name: "Tocopheryl Acetate (Vitamin E)",
          inci: "Tocopheryl Acetate",
          phase: "A",
          weightPct: 0.5,
          functionDesc: "Antioksidan Penstabil Fase Minyak",
        },
        {
          id: "ing-a12",
          name: "Disodium EDTA",
          inci: "Disodium EDTA",
          phase: "B",
          weightPct: 0.1,
          functionDesc: "Kelator Ion Logam Penstabil Kejernihan",
        },
        {
          id: "ing-a13",
          name: "Pelarut Tambahan & Penyeimbang",
          inci: "Butylene Glycol & Water",
          phase: "A",
          weightPct: 7.9,
          functionDesc: "Penyeimbang Kesetimbangan Massa 100%",
          isLocalTkdn: true,
        },
      ],
    };

    const candidateB: ParetoCandidateFormula = {
      id: "B",
      title: "Kandidat B: The Cost Leader",
      archetype: "Efisiensi Biaya Maksimal (Mass Market)",
      badgeLabel: "Paling Hemat",
      metrics: {
        stabilityPct: 87.2,
        cogsIdrPerKg: 24800,
        tkdnPct: 42.0,
        viscosityMpaS: 4950,
        systemHlb: 11.2,
      },
      tradeOffSummary:
        "Memangkas COGS hingga Rp 24.800/kg (penghematan 35%) dengan tetap mempertahankan batas kelulusan uji stabilitas 40°C di atas 85% dan TKDN di atas regulasi 40%.",
      physicochemicalRationale:
        "Memanfaatkan rasio emulgator komersial berbasis gliseril monostearat lokal yang dipadukan dengan xanthan gum terhidrasi penuh untuk memangkas porsi lipid impor berbiaya tinggi.",
      ingredients: [
        {
          id: "ing-b1",
          name: "Aqua Demineralisata",
          inci: "Water",
          phase: "A",
          weightPct: 72.0,
          functionDesc: "Pelarut Utama",
          isLocalTkdn: true,
        },
        {
          id: "ing-b2",
          name: "Glycerin (Vegetable USP 99.5%)",
          inci: "Glycerin",
          phase: "B",
          weightPct: 5.0,
          functionDesc: "Humektan Ekonomis",
          isLocalTkdn: true,
        },
        {
          id: "ing-b3",
          name: "Virgin Coconut Oil Terfraksi (Riau)",
          inci: "Caprylic/Capric Triglyceride",
          phase: "A",
          weightPct: 6.0,
          functionDesc: "Emolien Alami Lokal",
          isLocalTkdn: true,
        },
        {
          id: "ing-b4",
          name: "Glyceryl Stearate & PEG-100 Stearate",
          inci: "Glyceryl Stearate",
          phase: "C",
          weightPct: 3.2,
          functionDesc: "Sistem Pengemulsi Standar Massal",
        },
        {
          id: "ing-b5",
          name: "Cetyl Alcohol",
          inci: "Cetyl Alcohol",
          phase: "A",
          weightPct: 2.0,
          functionDesc: "Peningkat Konsistensi Lemak Nabati",
          isLocalTkdn: true,
        },
        {
          id: "ing-b6",
          name: "Niacinamide USP (Vitamin B3)",
          inci: "Niacinamide",
          phase: "D",
          weightPct: 2.0,
          functionDesc: "Bahan Aktif Pencerah Utama",
        },
        {
          id: "ing-b7",
          name: "Xanthan Gum (Clear Grade)",
          inci: "Xanthan Gum",
          phase: "B",
          weightPct: 0.4,
          functionDesc: "Pengental Polisakarida Efisien",
        },
        {
          id: "ing-b8",
          name: "Ekstrak Teh Hijau Ciwidey (Jawa Barat)",
          inci: "Camellia Sinensis Leaf Extract",
          phase: "D",
          weightPct: 1.0,
          functionDesc: "Antioksidan Penenang Lokal",
          isLocalTkdn: true,
        },
        {
          id: "ing-b9",
          name: "Phenoxyethanol & Ethylhexylglycerin",
          inci: "Phenoxyethanol",
          phase: "D",
          weightPct: 0.9,
          functionDesc: "Pengawet Sesuai Regulasi BPOM",
        },
        {
          id: "ing-b10",
          name: "Penstabil & Pengatur pH",
          inci: "Citric Acid & Disodium EDTA",
          phase: "B",
          weightPct: 0.2,
          functionDesc: "Buffer pH Sediaan",
        },
        {
          id: "ing-b11",
          name: "Pelarut Pembawa Propilen Glikol",
          inci: "Propylene Glycol",
          phase: "A",
          weightPct: 6.8,
          functionDesc: "Kosolven Penetrasi Cepat",
        },
      ],
    };

    const candidateC: ParetoCandidateFormula = {
      id: "C",
      title: "Kandidat C: The High-TKDN Local Hero",
      archetype: "Kandungan Hayati Nusantara Tertinggi",
      badgeLabel: "TKDN Tertinggi (61,8%)",
      metrics: {
        stabilityPct: 94.6,
        cogsIdrPerKg: 44200,
        tkdnPct: 61.8,
        viscosityMpaS: 5400,
        systemHlb: 10.4,
      },
      tradeOffSummary:
        "Memaksimalkan hilirisasi bahan lokal (TKDN mencapai 61,8%) dengan profil stabilitas sangat kokoh (94,6%), didukung kombinasi Tengkawang Shorea Butter dan VCO Riau murni.",
      physicochemicalRationale:
        "Kandungan trigliserida rantai sedang dari lipid nabati hutan Kalimantan dan Riau membentuk barrier film oklusif elastis tanpa rasa lengket, distabilkan oleh saponin pegagan alami.",
      ingredients: [
        {
          id: "ing-c1",
          name: "Aqua Demineralisata",
          inci: "Water",
          phase: "A",
          weightPct: 58.5,
          functionDesc: "Fase Air Pelarut",
          isLocalTkdn: true,
        },
        {
          id: "ing-c2",
          name: "Tengkawang Shorea Butter (Kalimantan)",
          inci: "Shorea Stenoptera Seed Butter",
          phase: "A",
          weightPct: 4.5,
          functionDesc: "Lipid Oklusif Pengganti Shea Butter Impor",
          isLocalTkdn: true,
        },
        {
          id: "ing-c3",
          name: "Virgin Coconut Oil Terfraksi (Riau)",
          inci: "Caprylic/Capric Triglyceride",
          phase: "A",
          weightPct: 9.0,
          functionDesc: "Emolien Sejuk Berkelanjutan",
          isLocalTkdn: true,
        },
        {
          id: "ing-c4",
          name: "Glycerin (Vegetable USP 99.5%)",
          inci: "Glycerin",
          phase: "B",
          weightPct: 5.0,
          functionDesc: "Humektan Nabati Lokal",
          isLocalTkdn: true,
        },
        {
          id: "ing-c5",
          name: "Cetearyl Glucoside & Cetearyl Alcohol",
          inci: "Cetearyl Glucoside",
          phase: "C",
          weightPct: 3.8,
          functionDesc: "Emulgator Lamellar Biodegradable",
        },
        {
          id: "ing-c6",
          name: "Ekstrak Centella Asiatica Garut",
          inci: "Centella Asiatica Extract",
          phase: "D",
          weightPct: 3.5,
          functionDesc: "Bahan Aktif Penenang Peradangan Kulit",
          isLocalTkdn: true,
        },
        {
          id: "ing-c7",
          name: "Ekstrak Teh Hijau Ciwidey (EGCG 95%)",
          inci: "Camellia Sinensis Leaf Extract",
          phase: "D",
          weightPct: 1.5,
          functionDesc: "Antioksidan Penolak Radikal Bebas Tropis",
          isLocalTkdn: true,
        },
        {
          id: "ing-c8",
          name: "Niacinamide USP (Vitamin B3)",
          inci: "Niacinamide",
          phase: "D",
          weightPct: 2.0,
          functionDesc: "Sinergi Pencerah",
        },
        {
          id: "ing-c9",
          name: "Acrylates/C10-30 Alkyl Acrylate Crosspolymer",
          inci: "Acrylates Copolymer",
          phase: "B",
          weightPct: 0.5,
          functionDesc: "Penstabil Droplet Minyak Berbobot",
        },
        {
          id: "ing-c10",
          name: "Sodium Hydroxide (10% Sol.)",
          inci: "Sodium Hydroxide",
          phase: "C",
          weightPct: 0.3,
          functionDesc: "Neutralizer Polimer Pengental",
        },
        {
          id: "ing-c11",
          name: "Phenoxyethanol & Ethylhexylglycerin",
          inci: "Phenoxyethanol",
          phase: "D",
          weightPct: 0.9,
          functionDesc: "Preservative Resmi BPOM",
        },
        {
          id: "ing-c12",
          name: "Pelarut Tambahan & Ekstrak Carrier",
          inci: "Butylene Glycol & Water",
          phase: "A",
          weightPct: 10.5,
          functionDesc: "Penyeimbang Kesetimbangan Formula",
          isLocalTkdn: true,
        },
      ],
    };

    // Link candidates to points on the frontier
    points[2].candidateId = "B"; // Cost leader at lower end
    points[12].candidateId = "A"; // Balanced sweet spot in the middle
    points[22].candidateId = "C"; // High TKDN at top end

    return {
      trialsEvaluated: params.trialsCount || 50000,
      executionTimeMs: 1380,
      nonDominatedCount: frontierSteps,
      hypervolumeScore: 0.892,
      points,
      topCandidates: [candidateA, candidateB, candidateC],
    };
  }
}
