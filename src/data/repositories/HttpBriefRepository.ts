import { IBriefRepository } from "@/domain/repositories/IBriefRepository";
import {
  ProjectBriefInput,
  FormulationBlueprint,
  ExistingFormulaChassis,
  HeroIngredientSelection,
  ChatMessage,
} from "@/domain/models/brief";

export class HttpBriefRepository implements IBriefRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  }

  async synthesizeBlueprint(brief: ProjectBriefInput): Promise<FormulationBlueprint> {
    const res = await fetch(`${this.baseUrl}/api/v1/orchestrator/synthesize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(brief),
    });
    if (!res.ok) throw new Error("Gagal menyintesis arsitektur formula");
    return res.json();
  }

  async parseMarketingPdf(file: File): Promise<{
    extractedBrief: Partial<ProjectBriefInput>;
    detectedClaims: string[];
    suggestedHeroIngredients: string[];
  }> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${this.baseUrl}/api/v1/orchestrator/parse-brief-pdf`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Gagal memproses dokumen PDF brief");
    return res.json();
  }

  async getExistingChassisList(): Promise<ExistingFormulaChassis[]> {
    const res = await fetch(`${this.baseUrl}/api/v1/orchestrator/chassis`);
    if (!res.ok) throw new Error("Gagal mengambil daftar formula acuan");
    return res.json();
  }

  async getHeroIngredientsCatalog(): Promise<HeroIngredientSelection[]> {
    const res = await fetch(`${this.baseUrl}/api/v1/orchestrator/hero-ingredients`);
    if (!res.ok) throw new Error("Gagal mengambil katalog bahan lokal");
    return res.json();
  }

  async sendChatMessage(
    message: string,
    activeContext: {
      brief: ProjectBriefInput;
      blueprint?: FormulationBlueprint | null;
    }
  ): Promise<ChatMessage> {
    const res = await fetch(`${this.baseUrl}/api/v1/copilot/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, context: activeContext }),
    });
    if (!res.ok) throw new Error("Gagal berkomunikasi dengan asisten AI");
    return res.json();
  }
}
