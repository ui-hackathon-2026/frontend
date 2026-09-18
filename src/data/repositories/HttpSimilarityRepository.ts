import { ISimilarityRepository } from "@/domain/repositories/ISimilarityRepository";
import {
  SimilarityIngredientInput,
  InternalSimilarityMatch,
  ExternalSimilarityResult,
} from "@/domain/models/similarity";
import { ApiClient } from "../api/api-client";

interface InternalMatchDto {
  formula_id: string;
  name: string;
  jaccard: number;
  cosine: number;
  chassis_overlap_pct: number;
}

interface InternalSimilarityResponseDto {
  matches: InternalMatchDto[];
}

interface ExternalMatchDto {
  brand: string;
  product_name: string;
  url: string;
  similarity: number;
  shared_ingredients: string[];
}

interface ExternalSimilarityResponseDto {
  novelty_score: number;
  estimated_basis: string;
  top_matches: ExternalMatchDto[];
}

interface SimilarityIngredientDto {
  inci: string;
  weight_pct: number;
}

function toDto(ingredients: SimilarityIngredientInput[]): SimilarityIngredientDto[] {
  return ingredients.map((i) => ({ inci: i.inci, weight_pct: i.weight_pct }));
}

export class HttpSimilarityRepository implements ISimilarityRepository {
  private client: ApiClient;

  constructor(client?: ApiClient) {
    this.client = client || new ApiClient();
  }

  async checkInternalSimilarity(
    ingredients: SimilarityIngredientInput[],
    excludeFormulaId?: string
  ): Promise<InternalSimilarityMatch[]> {
    const res = await this.client.post<
      { ingredients: SimilarityIngredientDto[] },
      InternalSimilarityResponseDto
    >("/api/v1/similarity/check", { ingredients: toDto(ingredients) });
    return res.matches
      .filter((m) => m.formula_id !== excludeFormulaId)
      .map((m) => ({
        formulaId: m.formula_id,
        name: m.name,
        jaccard: m.jaccard,
        cosine: m.cosine,
        chassisOverlapPct: m.chassis_overlap_pct,
      }));
  }

  async checkExternalSimilarity(
    ingredients: SimilarityIngredientInput[]
  ): Promise<ExternalSimilarityResult> {
    const res = await this.client.post<
      { ingredients: SimilarityIngredientDto[] },
      ExternalSimilarityResponseDto
    >("/api/v1/similarity/external", { ingredients: toDto(ingredients) });
    return {
      noveltyScore: res.novelty_score,
      estimatedBasis: res.estimated_basis,
      topMatches: res.top_matches.map((m) => ({
        brand: m.brand,
        productName: m.product_name,
        url: m.url,
        similarity: m.similarity,
        sharedIngredients: m.shared_ingredients,
      })),
    };
  }
}
