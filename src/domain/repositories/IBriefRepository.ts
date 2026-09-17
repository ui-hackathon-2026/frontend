import {
  ProjectBriefInput,
  FormulationBlueprint,
  ExistingFormulaChassis,
  HeroIngredientSelection,
  ChatMessage,
} from "../models/brief";

export interface IBriefRepository {
  /**
   * Synthesize formulation blueprint from structured brief parameters
   */
  synthesizeBlueprint(brief: ProjectBriefInput): Promise<FormulationBlueprint>;

  /**
   * Parse uploaded marketing brief PDF and map to technical formulation targets
   */
  parseMarketingPdf(file: File): Promise<{
    extractedBrief: Partial<ProjectBriefInput>;
    detectedClaims: string[];
    suggestedHeroIngredients: string[];
  }>;

  /**
   * Get list of Paragon existing chassis formulas for enhancement / reverse-engineering
   */
  getExistingChassisList(): Promise<ExistingFormulaChassis[]>;

  /**
   * Get catalog of local hero active ingredients
   */
  getHeroIngredientsCatalog(): Promise<HeroIngredientSelection[]>;

  /**
   * Send question or instruction to the Persistent AI Side Chat Assistant
   */
  sendChatMessage(
    message: string,
    activeContext: {
      brief: ProjectBriefInput;
      blueprint?: FormulationBlueprint | null;
    }
  ): Promise<ChatMessage>;
}
