import { IBriefRepository, ChatStreamHandlers } from "@/domain/repositories/IBriefRepository";
import {
  ProjectBriefInput,
  FormulationBlueprint,
  ExistingFormulaChassis,
  HeroIngredientSelection,
  ChatMessage,
} from "@/domain/models/brief";

export class MockBriefRepository implements IBriefRepository {
  private chassisCatalog: ExistingFormulaChassis[] = [
    {
      id: "chassis-wardah-hydra",
      name: "Wardah Hydra Rose Micro Gel Base",
      brand: "Wardah",
      category: "Gel-Cream",
      baseViscosity: 5200,
      cogsIdrPerKg: 38500,
      tkdnPct: 42.5,
      description: "Emulsi gel ringan dengan humektan gliserin & rose water, basis hidrasi 72 jam.",
    },
    {
      id: "chassis-kahf-oil-control",
      name: "Kahf Matte Defense Moisturizer Base",
      brand: "Kahf",
      category: "Gel-Cream",
      baseViscosity: 4600,
      cogsIdrPerKg: 34000,
      tkdnPct: 46.0,
      description: "Chassis moisturizer pria dengan sentuhan akhir matte velvety bebas kilap minyak.",
    },
    {
      id: "chassis-labore-barrier",
      name: "Laboré BiomeProtect Barrier Cream Base",
      brand: "Laboré",
      category: "Barrier Cream",
      baseViscosity: 8900,
      cogsIdrPerKg: 52000,
      tkdnPct: 41.0,
      description: "Formulasi dermokosmetik ramah mikrobioma untuk kulit hipersensitif tropis.",
    },
    {
      id: "chassis-emina-bright-stuff",
      name: "Emina Bright Stuff Serum Base",
      brand: "Emina",
      category: "Hydrating Serum",
      baseViscosity: 2200,
      cogsIdrPerKg: 29000,
      tkdnPct: 48.0,
      description: "Serum encer cepat meresap dengan konsentrasi niacinamide untuk konsumen gen-z.",
    },
  ];

  private heroIngredients: HeroIngredientSelection[] = [
    {
      id: "hero-1",
      name: "Ekstrak Centella Asiatica (Pegagan Jawa Barat)",
      inci: "Centella Asiatica Extract",
      localOrigin: "Jawa Barat (Garut)",
      benefit: "Penenang kulit inflamasi & perbaikan skin barrier",
      isLocalTkdn: true,
    },
    {
      id: "hero-2",
      name: "Virgin Coconut Oil (VCO Riau Terfraksi)",
      inci: "Cocos Nucifera (Coconut) Oil",
      localOrigin: "Riau (Indragiri Hilir)",
      benefit: "Emolien asam laurat antimikroba alami",
      isLocalTkdn: true,
    },
    {
      id: "hero-3",
      name: "Ekstrak Teh Hijau Ciwidey (EGCG 95%)",
      inci: "Camellia Sinensis Leaf Extract",
      localOrigin: "Ciwidey, Jawa Barat",
      benefit: "Antioksidan penangkal radikal bebas UV tropis",
      isLocalTkdn: true,
    },
    {
      id: "hero-4",
      name: "Tengkawang Butter (Shorea Stenoptera)",
      inci: "Shorea Stenoptera Seed Butter",
      localOrigin: "Kalimantan Barat",
      benefit: "Pelembap lipid padat nabati pengganti shea butter impor",
      isLocalTkdn: true,
    },
    {
      id: "hero-5",
      name: "Niacinamide USP (Vitamin B3 Murni)",
      inci: "Niacinamide",
      benefit: "Pencerah kulit & pengatur produksi sebum",
      isLocalTkdn: false,
    },
    {
      id: "hero-6",
      name: "Sodium Hyaluronate (Multi-Molecular)",
      inci: "Sodium Hyaluronate",
      benefit: "Pengikat air stratum korneum intensif",
      isLocalTkdn: false,
    },
  ];

  async getExistingChassisList(): Promise<ExistingFormulaChassis[]> {
    return this.chassisCatalog;
  }

  async getHeroIngredientsCatalog(): Promise<HeroIngredientSelection[]> {
    return this.heroIngredients;
  }

  async synthesizeBlueprint(brief: ProjectBriefInput): Promise<FormulationBlueprint> {
    // Simulate brief processing
    await new Promise((resolve) => setTimeout(resolve, 800));

    const isSunscreen = brief.category === "Sunscreen Emulsion";
    const isSerum = brief.category === "Hydrating Serum";

    return {
      blueprintId: "bp-" + Math.random().toString(36).substring(2, 9),
      title: brief.projectName || "Sintesis Formula " + brief.category,
      brand: brief.brand,
      category: brief.category,
      estimatedViscosityMpaS: brief.targetViscosityMpaS || (isSerum ? 2500 : 5400),
      systemHlb: isSunscreen ? 10.5 : 8.8,
      estimatedCogsIdrPerKg: Math.min(brief.maxCogsIdrPerKg, 38500),
      calculatedTkdnPct: Math.max(brief.targetTkdnPct, 44.5),
      phaseDistribution: {
        phaseA: isSerum ? 5.0 : 18.5,
        phaseB: isSerum ? 86.0 : 71.0,
        phaseC: 4.5,
        phaseD: 6.0,
      },
      ingredients: [
        {
          id: "bp-ing-1",
          name: "Aqua Demineralisata",
          inci: "Aqua",
          weightPct: isSerum ? 78.5 : 64.5,
          phase: "B",
          role: "solvent",
          isLocalTkdn: true,
          functionDesc: "Fase air utama pelarut elektrolit & humektan",
        },
        {
          id: "bp-ing-2",
          name: "Glycerin (Vegetable USP 99.5%)",
          inci: "Glycerin",
          weightPct: 4.5,
          phase: "B",
          role: "humectant",
          isLocalTkdn: true,
          functionDesc: "Penahan kelembapan stratum korneum",
        },
        {
          id: "bp-ing-3",
          name: "Virgin Coconut Oil Terfraksi (Riau)",
          inci: "Caprylic/Capric Triglyceride",
          weightPct: isSerum ? 2.5 : 8.0,
          phase: "A",
          role: "emollient",
          isLocalTkdn: true,
          functionDesc: "Emolien lipid ringan non-comedogenic lokal",
        },
        {
          id: "bp-ing-4",
          name: "Squalane (Olive Phytosqualane)",
          inci: "Squalane",
          weightPct: isSerum ? 1.5 : 4.5,
          phase: "A",
          role: "emollient",
          isLocalTkdn: false,
          functionDesc: "Kompatibilitas biomimetik sebum alami",
        },
        {
          id: "bp-ing-5",
          name: "Cetearyl Glucoside & Sorbitan Olivate",
          inci: "Cetearyl Glucoside",
          weightPct: 3.5,
          phase: "C",
          role: "emulsifier",
          isLocalTkdn: false,
          functionDesc: "Pengemulsi non-ionik lamellar gel network",
        },
        {
          id: "bp-ing-6",
          name: "Ekstrak Centella Asiatica Jawa Barat",
          inci: "Centella Asiatica Extract",
          weightPct: 2.5,
          phase: "D",
          role: "active",
          isLocalTkdn: true,
          functionDesc: "Bahan aktif penenang barrier kulit (Herbal Lokal)",
        },
        {
          id: "bp-ing-7",
          name: "Niacinamide USP (Vitamin B3)",
          inci: "Niacinamide",
          weightPct: 2.0,
          phase: "D",
          role: "active",
          isLocalTkdn: false,
          functionDesc: "Bahan aktif pencerah & kontrol sebum",
        },
        {
          id: "bp-ing-8",
          name: "Phenoxyethanol & Ethylhexylglycerin",
          inci: "Phenoxyethanol",
          weightPct: 0.9,
          phase: "D",
          role: "preservative",
          isLocalTkdn: false,
          functionDesc: "Pengawet spektrum luas aman Perka BPOM 17/2022",
        },
      ],
      scientificRationale:
        "Arsitektur emulsi gel O/W distabilkan oleh jaringan kristal cair pipih (lamellar gel network). Kombinasi emolien fraksi VCO lokal dan phytosqualane menghasilkan sensasi sensori ringan tanpa rasa lengket pada iklim tropis lembap, dengan cadangan polaritas humektan gliserin 4.5%.",
      initialRegulatoryClearance: {
        bpomCompliant: true,
        halalClearance: true,
        safetyMarginScore: 98.2,
      },
      createdAt: new Date().toISOString(),
    };
  }

  async parseMarketingPdf(file: File): Promise<{
    extractedBrief: Partial<ProjectBriefInput>;
    detectedClaims: string[];
    suggestedHeroIngredients: string[];
  }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const fileName = file.name.toLowerCase();

    const isKahf = fileName.includes("kahf") || fileName.includes("men");
    const isEmina = fileName.includes("emina") || fileName.includes("teen");
    const isSunscreen = fileName.includes("sun") || fileName.includes("spf");

    return {
      extractedBrief: {
        projectName: file.name.replace(/\.[^/.]+$/, ""),
        brand: isKahf ? "Kahf" : isEmina ? "Emina" : "Wardah",
        category: isSunscreen ? "Sunscreen Emulsion" : "Gel-Cream",
        skinProfile: isKahf ? "Kulit Berminyak & Berjerawat" : "Kulit Sensitif Tropis",
        sensoryFinish: isKahf ? "Matte Velvety" : "Lightweight Dewy",
        targetViscosityMpaS: isSunscreen ? 4500 : 5200,
        maxCogsIdrPerKg: 42000,
        targetTkdnPct: 45.0,
        targetSpf: isSunscreen ? 30 : undefined,
      },
      detectedClaims: [
        "Non-sticky finish under tropical climate (Jakarta/Surabaya)",
        "Halal Certified & Alcohol-Free Formulation",
        "Target TKDN minimum 40% (Kemenperin Standard)",
        "Dermatologically Tested for Asian Sensitive Skin",
      ],
      suggestedHeroIngredients: [
        "Ekstrak Centella Asiatica (Pegagan Jawa Barat)",
        "Virgin Coconut Oil (VCO Riau Terfraksi)",
        "Niacinamide USP (Vitamin B3 Murni)",
      ],
    };
  }

  async sendChatMessage(
    message: string,
    activeContext: {
      brief: ProjectBriefInput;
      blueprint?: FormulationBlueprint | null;
    },
    stream?: ChatStreamHandlers
  ): Promise<ChatMessage> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const lower = message.toLowerCase();
    let reply = "";
    let suggestedAction = undefined;

    if (lower.includes("tkdn") || lower.includes("lokal")) {
      reply =
        "Untuk mendongkrak TKDN hingga di atas 45%, Anda dapat mengadopsi Tengkawang Butter (Kalimantan Barat) sebagai pengganti Shea Butter impor dan VCO Riau terfraksi untuk Fase Minyak (A). Ini akan menambah skor TKDN sebesar +6.5%.";
      suggestedAction = {
        label: "Terapkan Bahan Hayati Lokal (TKDN +6.5%)",
        actionType: "set_tkdn" as const,
        payload: 48.5,
      };
    } else if (lower.includes("cogs") || lower.includes("biaya") || lower.includes("murah")) {
      reply =
        "Batas COGS Rp " +
        activeContext.brief.maxCogsIdrPerKg.toLocaleString("id-ID") +
        "/kg sangat ideal untuk sediaan " +
        activeContext.brief.brand +
        ". Rekomendasi saya adalah mengoptimalkan konsentrasi humektan gliserin nabati lokal yang memiliki rasio efektivitas biaya tertinggi.";
      suggestedAction = {
        label: "Optimalkan Estimasi COGS",
        actionType: "adjust_cogs" as const,
        payload: 35000,
      };
    } else if (lower.includes("viskositas") || lower.includes("kental")) {
      reply =
        "Untuk sediaan " +
        activeContext.brief.category +
        " dengan target sensori " +
        activeContext.brief.sensoryFinish +
        ", rentang viskositas 4.500–6.000 mPa·s adalah sweet spot emulsi stabil yang tidak mudah menetes saat diaplikasikan.";
    } else {
      reply =
        "Parameter brief untuk " +
        activeContext.brief.projectName +
        " (" +
        activeContext.brief.brand +
        ") telah dianalisis. Rasio fase A/B/C/D sudah memenuhi standar formulasi emulsi Paragon. Anda dapat langsung menekan tombol 'Sintesis Arsitektur Formula' atau bertanya rekomendasi bahan tambahan.";
    }

    if (stream?.onToken) {
      for (const word of reply.split(" ")) {
        stream.onToken(word + " ");
        await new Promise((resolve) => setTimeout(resolve, 15));
      }
    }

    return {
      id: "msg-" + Date.now(),
      sender: "assistant",
      content: reply,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      suggestedAction,
    };
  }
}
