import { IBriefRepository, ChatStreamHandlers } from "@/domain/repositories/IBriefRepository";
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
    },
    stream?: ChatStreamHandlers
  ): Promise<ChatMessage> {
    const res = await fetch(`${this.baseUrl}/api/v1/copilot/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        session_id: stream?.sessionId,
        canvas: { brief: activeContext.brief, blueprint: activeContext.blueprint ?? null },
      }),
    });
    if (!res.ok || !res.body) throw new Error("Gagal berkomunikasi dengan asisten AI");
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let reply = "";
    const assistantId = "asst-" + Date.now();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") continue;
        let evt: any;
        try {
          evt = JSON.parse(data);
        } catch {
          continue;
        }
        if (evt.type === "token" && typeof evt.token === "string") {
          reply += evt.token;
          stream?.onToken?.(evt.token);
        } else if (evt.type === "meta" && typeof evt.session_id === "string") {
          stream?.onSession?.(evt.session_id);
        } else if (evt.type === "error") {
          throw new Error(typeof evt.detail === "string" ? evt.detail : "AI error");
        }
      }
    }
    return {
      id: assistantId,
      sender: "assistant",
      content: reply,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };
  }
}
