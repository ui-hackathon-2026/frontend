import { ISimilarityRepository } from "@/domain/repositories/ISimilarityRepository";
import {
  SimilarityIngredientInput,
  InternalSimilarityMatch,
  ExternalSimilarityResult,
} from "@/domain/models/similarity";

// Mirrors backend app/services/similarity_service.py so the mock demo
// runs the same math the real API runs, not invented scores.

function jaccard(left: Set<string>, right: Set<string>): number {
  if (left.size === 0 && right.size === 0) return 0;
  let intersection = 0;
  left.forEach((v) => {
    if (right.has(v)) intersection += 1;
  });
  const union = new Set([...left, ...right]).size;
  return Math.round((intersection / union) * 1000) / 1000;
}

function cosine(left: Record<string, number>, right: Record<string, number>): number {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  let dot = 0;
  keys.forEach((k) => {
    dot += (left[k] ?? 0) * (right[k] ?? 0);
  });
  const normLeft = Math.sqrt(Object.values(left).reduce((s, v) => s + v * v, 0));
  const normRight = Math.sqrt(Object.values(right).reduce((s, v) => s + v * v, 0));
  if (normLeft === 0 || normRight === 0) return 0;
  return Math.round((dot / (normLeft * normRight)) * 1000) / 1000;
}

interface MockPhaseIngredient {
  inci: string;
  weight_pct: number;
  phase: "A" | "B" | "C" | "D";
}

function phaseVector(ingredients: MockPhaseIngredient[]): Record<string, number> {
  const vector: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const ing of ingredients) {
    vector[ing.phase] += ing.weight_pct;
  }
  return vector;
}

// Small internal comparison set — a self-contained demo corpus, not a
// live read of MockFormulaRepository (kept independent to avoid a
// circular import through the DI container).
const INTERNAL_CORPUS: { formulaId: string; name: string; ingredients: MockPhaseIngredient[] }[] = [
  {
    formulaId: "form_default_chassis",
    name: "Chassis Emulsi Tropis 40°C v1",
    ingredients: [
      { inci: "Squalane", weight_pct: 4.5, phase: "A" },
      { inci: "Caprylic/Capric Triglyceride", weight_pct: 3.5, phase: "A" },
      { inci: "Aqua", weight_pct: 73.0, phase: "B" },
      { inci: "Glycerin", weight_pct: 4.0, phase: "B" },
      { inci: "Glyceryl Stearate", weight_pct: 2.8, phase: "C" },
      { inci: "Niacinamide", weight_pct: 3.0, phase: "D" },
      { inci: "Panthenol", weight_pct: 1.5, phase: "D" },
    ],
  },
  {
    formulaId: "form_wardah_hydra_gel",
    name: "Wardah Hydra Rose Moisture Gel (referensi internal)",
    ingredients: [
      { inci: "Aqua", weight_pct: 78.0, phase: "B" },
      { inci: "Glycerin", weight_pct: 5.0, phase: "B" },
      { inci: "Niacinamide", weight_pct: 2.0, phase: "D" },
      { inci: "Squalane", weight_pct: 3.0, phase: "A" },
      { inci: "Carbomer", weight_pct: 0.3, phase: "B" },
    ],
  },
  {
    formulaId: "form_kahf_sunscreen_gel",
    name: "Kahf Sunscreen Gel SPF50 (referensi internal)",
    ingredients: [
      { inci: "Aqua", weight_pct: 60.0, phase: "B" },
      { inci: "Ethylhexyl Methoxycinnamate", weight_pct: 7.5, phase: "A" },
      { inci: "Butylene Glycol", weight_pct: 4.0, phase: "B" },
      { inci: "Panthenol", weight_pct: 1.0, phase: "D" },
    ],
  },
];

const SYNONYMS: Record<string, string> = {
  water: "aqua",
  eau: "aqua",
  parfum: "fragrance",
};

function normalizeName(raw: string): string {
  const cleaned = raw
    .replace(/[​-‏﻿™®]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return SYNONYMS[cleaned] ?? cleaned;
}

function pseudoWeights(names: string[]): Record<string, number> {
  const alpha = 0.75;
  const weights = names.map((_, rank) => alpha ** rank);
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const merged: Record<string, number> = {};
  names.forEach((name, i) => {
    merged[name] = (merged[name] ?? 0) + weights[i] / total;
  });
  return merged;
}

const EXTERNAL_CORPUS: { brand: string; productName: string; url: string; inciList: string[] }[] = [
  {
    brand: "Wardah",
    productName: "Hydra Rose Moisture Gel",
    url: "https://incidecoder.com/products/wardah-hydra-rose-moisture-gel",
    inciList: ["Aqua", "Glycerin", "Niacinamide", "Squalane", "Carbomer", "Phenoxyethanol"],
  },
  {
    brand: "Somethinc",
    productName: "Niacinamide + Moisture Gel",
    url: "https://incidecoder.com/products/somethinc-niacinamide-moisture-gel",
    inciList: ["Water", "Niacinamide", "Glycerin", "Panthenol", "Allantoin", "Disodium EDTA"],
  },
  {
    brand: "Avoskin",
    productName: "Miraculous Refining Toner",
    url: "https://incidecoder.com/products/avoskin-miraculous-refining-toner",
    inciList: ["Aqua", "Butylene Glycol", "Glycolic Acid", "Centella Asiatica Extract"],
  },
  {
    brand: "Emina",
    productName: "Bright Stuff Moisture Gel",
    url: "https://incidecoder.com/products/emina-bright-stuff-moisture-gel",
    inciList: ["Water", "Glycerin", "Niacinamide", "Squalane", "Tocopheryl Acetate", "Fragrance"],
  },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockSimilarityRepository implements ISimilarityRepository {
  async checkInternalSimilarity(
    ingredients: SimilarityIngredientInput[],
    excludeFormulaId?: string
  ): Promise<InternalSimilarityMatch[]> {
    await delay(500);
    const querySet = new Set(ingredients.map((i) => i.inci));
    const queryWeights: Record<string, number> = {};
    ingredients.forEach((i) => (queryWeights[i.inci] = i.weight_pct));
    const queryPhaseVector = phaseVector(
      ingredients.filter((i): i is Required<SimilarityIngredientInput> => !!i.phase)
    );

    const matches = INTERNAL_CORPUS.filter(
      (formula) => formula.formulaId !== excludeFormulaId
    ).map((formula) => {
      const storedSet = new Set(formula.ingredients.map((i) => i.inci));
      const storedWeights: Record<string, number> = {};
      formula.ingredients.forEach((i) => (storedWeights[i.inci] = i.weight_pct));
      return {
        formulaId: formula.formulaId,
        name: formula.name,
        jaccard: jaccard(querySet, storedSet),
        cosine: cosine(queryWeights, storedWeights),
        chassisOverlapPct:
          Math.round(
            cosine(queryPhaseVector, phaseVector(formula.ingredients)) * 1000
          ) / 10,
      };
    });

    matches.sort((a, b) => (b.jaccard + b.cosine) / 2 - (a.jaccard + a.cosine) / 2);
    return matches.slice(0, 5);
  }

  async checkExternalSimilarity(
    ingredients: SimilarityIngredientInput[]
  ): Promise<ExternalSimilarityResult> {
    await delay(650);
    const queryNames = ingredients.map((i) => normalizeName(i.inci));
    const queryWeights: Record<string, number> = {};
    ingredients.forEach((i, idx) => {
      queryWeights[queryNames[idx]] = i.weight_pct / 100;
    });

    const scored = EXTERNAL_CORPUS.map((entry) => {
      const names = entry.inciList.map(normalizeName);
      const nameSet = new Set(names);
      const shared = queryNames.filter((n) => nameSet.has(n));
      const weights = pseudoWeights(names);
      const similarity = cosine(queryWeights, weights);
      return { entry, similarity, shared: Array.from(new Set(shared)) };
    })
      .filter((s) => s.shared.length > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    const best = scored.length > 0 ? scored[0].similarity : 0;

    return {
      noveltyScore: Math.round((1 - best) * 1000) / 1000,
      estimatedBasis: "label-order pseudo-weights, not lab percentages",
      topMatches: scored.map((s) => ({
        brand: s.entry.brand,
        productName: s.entry.productName,
        url: s.entry.url,
        similarity: s.similarity,
        sharedIngredients: s.shared.slice(0, 10),
      })),
    };
  }
}
