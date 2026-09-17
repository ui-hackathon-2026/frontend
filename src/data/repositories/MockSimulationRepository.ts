import { ISimulationRepository } from "@/domain/repositories/ISimulationRepository";
import {
  SimulationRequest,
  SimulationResult,
  StabilityVerdict,
  DropletDistributionPoint,
  RheologyPoint,
  IngredientInput,
  PresetFormulaItem,
} from "@/domain/models/simulation";

export class MockSimulationRepository implements ISimulationRepository {
  private history: Map<string, SimulationResult> = new Map();

  constructor() {
    this.seedDefaultRuns();
  }

  async simulateStability(request: SimulationRequest): Promise<SimulationResult> {
    // Realistic simulated compute latency:
    // LightGBM GPU: ~300ms simulated latency
    // Deep Colloid GNN: ~600ms simulated latency
    const simulatedWaitMs = request.engine === "LIGHTGBM_GPU" ? 380 : 750;
    await new Promise((resolve) => setTimeout(resolve, simulatedWaitMs));

    // Calculate actual chemical physics from ingredients
    const phaseAWeight = request.ingredients
      .filter((i) => i.phase === "A")
      .reduce((sum, i) => sum + i.weightPct, 0);

    const phaseCWeight = request.ingredients
      .filter((i) => i.phase === "C")
      .reduce((sum, i) => sum + i.weightPct, 0);

    const thickenerWeight = request.ingredients
      .filter((i) => i.role === "thickener")
      .reduce((sum, i) => sum + i.weightPct, 0);

    // Surfactant-to-Oil Ratio (SOR)
    const effectiveOil = Math.max(phaseAWeight, 1.0);
    const sor = phaseCWeight / effectiveOil;

    // Temperature degradation factor (relative to 40°C benchmark)
    const tempDelta = request.temperatureC - 40;
    const tempPenalty = tempDelta > 0 ? (tempDelta / 10) * 0.08 : 0;
    const durationPenalty = (request.durationDays - 90) * 0.001;

    // Base stability score calculated deterministically from chemistry
    let rawScore = 0.5;
    if (sor >= 0.28) {
      rawScore = 0.94 - Math.abs(sor - 0.35) * 0.15;
    } else if (sor >= 0.18) {
      rawScore = 0.78 + (sor - 0.18) * 1.2;
    } else {
      rawScore = 0.45 + sor * 1.5;
    }

    rawScore = Math.max(0.3, Math.min(0.985, rawScore - tempPenalty - durationPenalty));

    // Determine verdict
    let verdict: StabilityVerdict = "HIGHLY_STABLE";
    if (rawScore >= 0.85) {
      verdict = "HIGHLY_STABLE";
    } else if (rawScore >= 0.70) {
      verdict = "MODERATELY_STABLE";
    } else if (rawScore >= 0.55) {
      verdict = "UNSTABLE_RISK";
    } else {
      verdict = "PHASE_SEPARATION_IMMINENT";
    }

    // Viscosity calculation based on thickeners + emulsifiers
    const baseViscosity = 1500;
    const calculatedViscosity = Math.round(
      baseViscosity +
        thickenerWeight * 1800 +
        phaseCWeight * 800 +
        (phaseAWeight > 10 ? 800 : 200) -
        tempDelta * 45
    );

    // Mean droplet size (nm) - inversely proportional to surfactant ratio and stability
    const meanDropletSizeNm = Math.round((1.0 - rawScore * 0.7) * 280 * 10) / 10;
    const pdi = Math.round((0.12 + (1.0 - rawScore) * 0.35) * 1000) / 1000;

    // Generate bell curve for droplet size distribution
    const dropletDistribution: DropletDistributionPoint[] = [];
    for (let d = 40; d <= 600; d += 20) {
      const exponent = -Math.pow(d - meanDropletSizeNm, 2) / (2 * Math.pow(meanDropletSizeNm * pdi, 2));
      const freq = Math.round(Math.exp(exponent) * 28 * 10) / 10;
      if (freq > 0.1) {
        dropletDistribution.push({ diameterNm: d, volumeFrequencyPct: freq });
      }
    }

    // Generate rheology curve (pseudoplastic shear-thinning)
    const shearRates = [0.1, 1, 10, 50, 100, 500, 1000];
    const rheologyCurve: RheologyPoint[] = shearRates.map((sr) => {
      // Carreau-Yasuda power-law pseudoplastic decay
      const visc = Math.round(calculatedViscosity / Math.pow(1 + sr * 0.08, 0.45));
      return { shearRateS1: sr, viscosityMpaS: Math.max(80, visc) };
    });

    // Check Out-of-Distribution (OOD)
    const hasRareIngredient = request.ingredients.some(
      (i) => i.weightPct > 20 && i.role !== "solvent"
    );
    const oodDistance = hasRareIngredient ? 4.82 : 1.15;
    const isOod = oodDistance > 3.0;

    // Thermodynamic factors
    const deltaHlb = Math.round(Math.abs(11.2 - 10.5) * 10) / 10;
    const gibbsEnergy = Math.round((-14.8 + (1 - rawScore) * 22) * 10) / 10;

    const riskFactors: string[] = [];
    const stabilizingFactors: string[] = [];
    const recommendations: string[] = [];

    if (verdict === "HIGHLY_STABLE") {
      stabilizingFactors.push(
        "Rasio Emulgator-Minyak (SOR = " +
          sor.toFixed(2) +
          ") berada di rentang optimal untuk pembentukan lamellar gel network."
      );
      stabilizingFactors.push(
        "Energi bebas Gibbs emulsifikasi negatif (ΔG = " +
          gibbsEnergy +
          " kJ/mol), menunjukkan pembentukan fase spontan dan stabil secara termodinamika."
      );
      recommendations.push("Formula aman dilanjutkan ke pengujian sensori panelis dan pilot-scale 5 kg.");
    } else if (verdict === "MODERATELY_STABLE") {
      riskFactors.push(
        "Fluktuasi viskositas moderat pada suhu " +
          request.temperatureC +
          "°C setelah 60 hari penyimpanan."
      );
      stabilizingFactors.push("Sistem pengawet dan chelating agent dalam batas aman.");
      recommendations.push(
        "Tingkatkan konsentrasi co-emulsifier Cetearyl Glucoside sebesar +0.50% untuk memperkokoh antarmuka tetesan."
      );
    } else {
      riskFactors.push(
        "Defisit pengemulsi di antarmuka tetesan (SOR = " +
          sor.toFixed(2) +
          " < 0.25). Kecepatan koalesensi tetesan tinggi (Ostwald ripening)."
      );
      riskFactors.push(
        "Risiko pemisahan fase (creaming/oil separation) pada hari ke-35 di inkubator 40°C."
      );
      recommendations.push(
        "Wajib menambahkan minimal +1.20% Cetearyl Glucoside atau Polyglyceryl-3 Polyricinoleate di Fase C."
      );
      recommendations.push(
        "Gunakan homogenizer kecepatan tinggi (4.500 RPM, 10 menit) pada suhu 75°C sebelum pendinginan."
      );
    }

    const result: SimulationResult = {
      runId: `run_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      formulaId: request.formulaId || `form_${Math.floor(Math.random() * 90000 + 10000)}`,
      formulaName: request.formulaName,
      temperatureC: request.temperatureC,
      durationDays: request.durationDays,
      engineUsed: request.engine,
      inferenceDurationMs: request.engine === "LIGHTGBM_GPU" ? 0.74 : 14.8,
      createdAt: new Date().toISOString(),
      stabilityScore: Math.round(rawScore * 1000) / 1000,
      verdict,
      confidenceScore: isOod ? 0.742 : 0.985,
      isOutOfDistribution: isOod,
      oodMahalanobisDistance: oodDistance,
      dynamicViscosityMpaS: calculatedViscosity,
      targetViscosityMpaS: 5500,
      meanDropletSizeNm,
      polydispersityIndexPdi: pdi,
      dropletDistribution,
      rheologyCurve,
      thermodynamics: {
        deltaHlb,
        sorRatio: Math.round(sor * 100) / 100,
        packingParameterP: 0.92,
        gibbsFreeEnergyKjMol: gibbsEnergy,
        criticalMicelleConcentrationMmolL: 0.042,
        interfaceState:
          verdict === "HIGHLY_STABLE"
            ? "Monolayer Saturated"
            : verdict === "MODERATELY_STABLE"
            ? "Bicontinuous Mesophase"
            : "Depleted Boundary",
      },
      riskFactors,
      stabilizingFactors,
      recommendations,
    };

    this.history.set(result.runId, result);
    return result;
  }

  async getSimulationRun(runId: string): Promise<SimulationResult | null> {
    return this.history.get(runId) || null;
  }

  async getPresetFormulas(): Promise<PresetFormulaItem[]> {
    return [
      {
        id: "preset-spf30-stable",
        name: "SPF 30+ Daily Hydrating Gel-Cream",
        category: "Sunscreen Emulsion (O/W)",
        description:
          "Formula terkalibrasi tinggi dengan surfaktan Cetearyl Glucoside & Niacinamide 2%. Teruji 94.2% stabil di 40°C.",
        request: {
          formulaName: "SPF 30+ Daily Hydrating Gel-Cream",
          temperatureC: 40,
          durationDays: 90,
          engine: "LIGHTGBM_GPU",
          ingredients: [
            {
              id: "ing-1",
              name: "Octyl Methoxycinnamate (OMC)",
              inci: "Ethylhexyl Methoxycinnamate",
              smiles: "CCCCCC(CC)COC(=O)C=CC1=CC=C(C=C1)OC",
              weightPct: 7.5,
              phase: "A",
              role: "active",
            },
            {
              id: "ing-2",
              name: "Avobenzone (Butyl Methoxydibenzoylmethane)",
              inci: "Butyl Methoxydibenzoylmethane",
              smiles: "CC(C)(C)C1=CC=C(C=C1)C(=O)CC(=O)C2=CC=C(C=C2)OC",
              weightPct: 3.0,
              phase: "A",
              role: "active",
            },
            {
              id: "ing-3",
              name: "Cetearyl Alcohol",
              inci: "Cetearyl Alcohol",
              smiles: "CCCCCCCCCCCCCCCCO",
              weightPct: 2.0,
              phase: "A",
              role: "emollient",
            },
            {
              id: "ing-4",
              name: "Aqua Demineralisata",
              inci: "Aqua",
              smiles: "O",
              weightPct: 73.0,
              phase: "B",
              role: "solvent",
            },
            {
              id: "ing-5",
              name: "Glycerin (Vegetable USP)",
              inci: "Glycerin",
              smiles: "C(C(CO)O)O",
              weightPct: 5.0,
              phase: "B",
              role: "emollient",
            },
            {
              id: "ing-6",
              name: "Cetearyl Glucoside & Sorbitan Olivate",
              inci: "Cetearyl Glucoside",
              smiles: "CCCCCCCCCCCCCCCCO[C@H]1[C@@H]([C@H]([C@@H]([C@H](O1)CO)O)O)O",
              weightPct: 3.5,
              phase: "C",
              role: "emulsifier",
            },
            {
              id: "ing-7",
              name: "Niacinamide (Vitamin B3 USP)",
              inci: "Niacinamide",
              smiles: "C1=CC(=CN=C1)C(=O)N",
              weightPct: 2.0,
              phase: "D",
              role: "active",
            },
            {
              id: "ing-8",
              name: "Phenoxyethanol & Ethylhexylglycerin",
              inci: "Phenoxyethanol",
              smiles: "C1=CC=C(C=C1)OCCO",
              weightPct: 0.8,
              phase: "D",
              role: "preservative",
            },
            {
              id: "ing-9",
              name: "Camellia Sinensis (Green Tea) Leaf Extract",
              inci: "Camellia Sinensis Leaf Extract",
              smiles: "OC1=CC(=C2C(=C1)OC(C(C2)O)C3=CC(=C(C(=C3)O)O)O)O",
              weightPct: 3.2,
              phase: "D",
              role: "active",
            },
          ] as IngredientInput[],
        },
      },
      {
        id: "preset-botanical-tkdn",
        name: "Tropical Brightening Serum-Lotion (TKDN 45%)",
        category: "Botanical Bio-Emulsion",
        description:
          "Memanfaatkan Virgin Coconut Oil lokal Riau dan ekstrak Centella Asiatica. Stabilitas moderat 78.5%.",
        request: {
          formulaName: "Tropical Brightening Serum-Lotion (TKDN 45%)",
          temperatureC: 40,
          durationDays: 90,
          engine: "DEEP_COLLOID_GNN",
          ingredients: [
            {
              id: "b-1",
              name: "Virgin Coconut Oil (VCO Riau)",
              inci: "Cocos Nucifera Oil",
              smiles: "CCCCCCCCCCCC(=O)OCC(COC(=O)CCCCCCCCCCC)OC(=O)CCCCCCCCCCC",
              weightPct: 6.0,
              phase: "A",
              role: "emollient",
            },
            {
              id: "b-2",
              name: "Aqua Demineralisata",
              inci: "Aqua",
              smiles: "O",
              weightPct: 78.5,
              phase: "B",
              role: "solvent",
            },
            {
              id: "b-3",
              name: "Polyglyceryl-4 Caprate",
              inci: "Polyglyceryl-4 Caprate",
              smiles: "CCCCCCCCCC(=O)OCC(CO)O",
              weightPct: 2.0,
              phase: "C",
              role: "emulsifier",
            },
            {
              id: "b-4",
              name: "Centella Asiatica Extract (Jawa Barat)",
              inci: "Centella Asiatica Leaf Extract",
              smiles: "CC1C2CC(C3(C2(CCC3(C(=O)O)C)C)C)CCC1(C)O",
              weightPct: 5.0,
              phase: "D",
              role: "active",
            },
            {
              id: "b-5",
              name: "Niacinamide 99.8%",
              inci: "Niacinamide",
              smiles: "C1=CC(=CN=C1)C(=O)N",
              weightPct: 3.0,
              phase: "D",
              role: "active",
            },
            {
              id: "b-6",
              name: "Natural Benzyl Alcohol & Dehydroacetic Acid",
              inci: "Benzyl Alcohol",
              smiles: "C1=CC=C(C=C1)CO",
              weightPct: 0.9,
              phase: "D",
              role: "preservative",
            },
            {
              id: "b-7",
              name: "Xanthan Gum (Bio-Ferment)",
              inci: "Xanthan Gum",
              smiles: "C12H20O10",
              weightPct: 0.6,
              phase: "B",
              role: "thickener",
            },
            {
              id: "b-8",
              name: "Butylene Glycol",
              inci: "Butylene Glycol",
              smiles: "CC(CCO)O",
              weightPct: 4.0,
              phase: "B",
              role: "emollient",
            },
          ] as IngredientInput[],
        },
      },
      {
        id: "preset-unstable-deficit",
        name: "Low-Emulsifier Trial (Deficit Risk Stress Test)",
        category: "Stress Test Emulsion",
        description:
          "Formula simulasi defisit emulgator (hanya 0.8% Phase C) untuk mendeteksi peringatan dini pemisahan fase (54.0% score).",
        request: {
          formulaName: "Low-Emulsifier Trial (Deficit Risk Stress Test)",
          temperatureC: 40,
          durationDays: 90,
          engine: "LIGHTGBM_GPU",
          ingredients: [
            {
              id: "u-1",
              name: "Mineral Oil (Heavy Hydrocarbon)",
              inci: "Paraffinum Liquidum",
              smiles: "CCCCCCCCCCCCCCCC",
              weightPct: 15.0,
              phase: "A",
              role: "emollient",
            },
            {
              id: "u-2",
              name: "Aqua Demineralisata",
              inci: "Aqua",
              smiles: "O",
              weightPct: 80.2,
              phase: "B",
              role: "solvent",
            },
            {
              id: "u-3",
              name: "Polysorbate 20 (Deficit)",
              inci: "Polysorbate 20",
              smiles: "C26H50O10",
              weightPct: 0.8,
              phase: "C",
              role: "emulsifier",
            },
            {
              id: "u-4",
              name: "Carbomer 940",
              inci: "Carbomer",
              smiles: "C3H4O2",
              weightPct: 0.2,
              phase: "B",
              role: "thickener",
            },
            {
              id: "u-5",
              name: "Triethanolamine 99%",
              inci: "Triethanolamine",
              smiles: "C6H15NO3",
              weightPct: 0.3,
              phase: "B",
              role: "solvent",
            },
            {
              id: "u-6",
              name: "DMDM Hydantoin",
              inci: "DMDM Hydantoin",
              smiles: "C7H12N2O4",
              weightPct: 0.5,
              phase: "D",
              role: "preservative",
            },
            {
              id: "u-7",
              name: "Glycerin USP",
              inci: "Glycerin",
              smiles: "C(C(CO)O)O",
              weightPct: 3.0,
              phase: "B",
              role: "emollient",
            },
          ] as IngredientInput[],
        },
      },
    ];
  }

  private seedDefaultRuns() {
    // Seed initial run
  }
}
