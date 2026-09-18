import {
  SimilarityIngredientInput,
  InternalSimilarityMatch,
  ExternalSimilarityResult,
} from "../models/similarity";

export interface ISimilarityRepository {
  /**
   * Compare a formula's composition against every other formula stored
   * internally (Jaccard + cosine over ingredient sets, chassis overlap
   * over phase-fraction vectors). The backend scores the full formula
   * table with no self-exclusion, so pass `excludeFormulaId` (the
   * formula being checked) to drop its own trivial 1.0 match.
   */
  checkInternalSimilarity(
    ingredients: SimilarityIngredientInput[],
    excludeFormulaId?: string
  ): Promise<InternalSimilarityMatch[]>;

  /**
   * Compare a formula's composition against the scraped competitor
   * product corpus (label-order pseudo-weights, not lab percentages).
   */
  checkExternalSimilarity(
    ingredients: SimilarityIngredientInput[]
  ): Promise<ExternalSimilarityResult>;
}
