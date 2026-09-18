export interface SimilarityIngredientInput {
  inci: string;
  weight_pct: number;
  /** Optional: only used client-side (e.g. mock chassis-overlap math). The
   * real API derives phase server-side from its own ingredient catalog. */
  phase?: "A" | "B" | "C" | "D";
}

export interface InternalSimilarityMatch {
  formulaId: string;
  name: string;
  jaccard: number;
  cosine: number;
  chassisOverlapPct: number;
}

export interface ExternalSimilarityMatch {
  brand: string;
  productName: string;
  url: string;
  similarity: number;
  sharedIngredients: string[];
}

export interface ExternalSimilarityResult {
  noveltyScore: number;
  estimatedBasis: string;
  topMatches: ExternalSimilarityMatch[];
}
