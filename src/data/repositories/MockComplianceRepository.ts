import { IComplianceRepository } from "@/domain/repositories/IComplianceRepository";
import {
  ComplianceAuditReport,
  IngredientAuditItem,
  RagChatMessage,
} from "@/domain/models/compliance";
import { IngredientInput } from "@/domain/models/simulation";

export class MockComplianceRepository implements IComplianceRepository {
  async auditFormula(
    formulaName: string,
    category: string,
    ingredients: IngredientInput[]
  ): Promise<ComplianceAuditReport> {
    // Simulated realistic hybrid RAG + LLM latency: ~380ms
    await new Promise((r) => setTimeout(r, 380));

    let hasViolation = false;
    let hasWarning = false;
    let tkdnSum = 0;
    let totalWeight = 0;

    const auditedIngredients: IngredientAuditItem[] = ingredients.map((ing) => {
      totalWeight += ing.weightPct;
      const lowerInci = ing.inci.toLowerCase();
      const lowerName = ing.name.toLowerCase();

      let bpomLimit: number | undefined = undefined;
      let status: "PASSED" | "WARNING" | "VIOLATION" = "PASSED";
      let halalStatus: "HALAL_CERTIFIED" | "NEEDS_AUDIT" | "CRITICAL_NON_HALAL" = "HALAL_CERTIFIED";
      let tkdnPct = 0;
      let ragCitation: any = undefined;
      let auditNotes = "Bahan mematuhi monografi umum BPOM dan tersertifikasi halal nabati.";

      // 1. Check Preservatives Limits
      if (lowerInci.includes("phenoxyethanol")) {
        bpomLimit = 1.0;
        tkdnPct = 20;
        ragCitation = {
          regulation: "Peraturan BPOM No. 17 Tahun 2022",
          appendix: "Lampiran V (Pengawet yang Diizinkan)",
          clauseNumber: "Entri No. 29",
          excerpt: "Kadar maksimum yang diizinkan pada sediaan siap pakai adalah 1,0%. Tidak diperuntukkan bagi sediaan aerosol.",
        };
        if (ing.weightPct > 1.0) {
          status = "VIOLATION";
          hasViolation = true;
          auditNotes = `PELANGGARAN BPOM: Konsentrasi (${ing.weightPct}%) melebihi batas legal maksimum (1.0%).`;
        } else if (ing.weightPct > 0.8) {
          status = "WARNING";
          hasWarning = true;
          auditNotes = `Mendekati batas maksimum (1.0%). Disarankan menurunkan dosis ke 0.6% - 0.8% untuk efisiensi Margin of Safety (MoS).`;
        }
      } else if (lowerInci.includes("paraben") || lowerName.includes("paraben")) {
        bpomLimit = 0.4;
        tkdnPct = 0;
        ragCitation = {
          regulation: "Peraturan BPOM No. 17 Tahun 2022",
          appendix: "Lampiran V (Pengawet yang Diizinkan)",
          clauseNumber: "Entri No. 12",
          excerpt: "Methylparaben maksimum 0,4% (dihitung sebagai asam). Dilarang untuk sediaan area popok anak di bawah 3 tahun.",
        };
        if (ing.weightPct > 0.4) {
          status = "VIOLATION";
          hasViolation = true;
          auditNotes = `PELANGGARAN BPOM: Konsentrasi melebihi ambang batas 0.4%.`;
        }
      } else if (lowerInci.includes("methoxycinnamate") || lowerName.includes("omc")) {
        bpomLimit = 10.0;
        tkdnPct = 0;
        ragCitation = {
          regulation: "Peraturan BPOM No. 17 Tahun 2022",
          appendix: "Lampiran IV (Bahan Tabir Surya yang Diizinkan)",
          clauseNumber: "Entri No. 14",
          excerpt: "Ethylhexyl Methoxycinnamate maksimum 10,0%. Wajib mencantumkan instruksi proteksi ulang pada label kemasan.",
        };
        if (ing.weightPct > 10.0) {
          status = "VIOLATION";
          hasViolation = true;
          auditNotes = `PELANGGARAN BPOM: UV filter melebihi batas 10.0%.`;
        }
      } else if (lowerInci.includes("arbutin")) {
        bpomLimit = 2.0;
        tkdnPct = 0;
        ragCitation = {
          regulation: "Peraturan BPOM No. 17 Tahun 2022",
          appendix: "Lampiran II (Bahan Aktif dengan Batasan Kadar)",
          clauseNumber: "Entri No. 7",
          excerpt: "Alpha-Arbutin maksimum 2,0% untuk produk krim/serum wajah. Dilarang menghasilkan residu hidrokuinon > 1 ppm.",
        };
        if (ing.weightPct > 2.0) {
          status = "VIOLATION";
          hasViolation = true;
          auditNotes = `PELANGGARAN BPOM: Alpha-Arbutin melebihi batas 2.0%.`;
        }
      } else if (lowerInci.includes("cocos nucifera") || lowerName.includes("vco")) {
        tkdnPct = 100;
        ragCitation = {
          regulation: "Kemenperin No. 16/2020 & Katalog Hayati Nusantara",
          appendix: "Komoditas Minyak Hayati Lokal",
          clauseNumber: "KBKI 2020",
          excerpt: "Minyak Kelapa Murni (Virgin Coconut Oil) produksi petani lokal terverifikasi nilai TKDN 100%.",
        };
        auditNotes = "Bahan hayati nusantara tersertifikasi TKDN 100% dan Halal BPJPH.";
      } else if (lowerInci.includes("centella") || lowerName.includes("pegagan")) {
        tkdnPct = 95;
        ragCitation = {
          regulation: "Kemenperin No. 16/2020 & Farmakope Herbal Indonesia",
          appendix: "Ekstrak Bahan Botani Indonesia",
          clauseNumber: "Monografi Pegagan",
          excerpt: "Ekstrak Centella Asiatica dari perkebunan Jawa Barat, nilai TKDN 95%.",
        };
        auditNotes = "Antioksidan dan skin-soothing hayati lokal tersertifikasi halal murni.";
      } else if (lowerInci.includes("aqua")) {
        tkdnPct = 100;
      } else if (lowerInci.includes("glycerin")) {
        tkdnPct = 90;
        ragCitation = {
          regulation: "Kriteria Sistem Jaminan Halal HAS 23000",
          appendix: "Titik Kritis Bahan Nabati vs Hewani",
          clauseNumber: "HAS-23000-GLY",
          excerpt: "Gliserin wajib diverifikasi berasal dari fraksinasi minyak kelapa sawit nabati (RSPO) dan bebas dari turunan hewani.",
        };
        auditNotes = "Tersertifikasi 100% Palm-derived Vegetable USP Halal.";
      } else {
        tkdnPct = 25;
      }

      tkdnSum += (tkdnPct * ing.weightPct);

      return {
        id: ing.id,
        name: ing.name,
        inci: ing.inci,
        weightPct: ing.weightPct,
        phase: ing.phase,
        role: ing.role,
        status,
        bpomLimitPct: bpomLimit,
        halalStatus,
        tkdnPct,
        ragCitation,
        auditNotes,
      };
    });

    const averageTkdn = totalWeight > 0 ? Math.round(tkdnSum / totalWeight) : 0;
    const overallStatus = hasViolation
      ? "NON_COMPLIANT_VIOLATION"
      : hasWarning
      ? "CONDITIONAL_APPROVAL"
      : "COMPLIANT";

    const complianceScore = hasViolation ? 0.62 : hasWarning ? 0.88 : 0.99;

    return {
      auditId: `audit_rag_${Date.now()}`,
      formulaName,
      category,
      overallStatus,
      complianceScore,
      halalStatus: "HALAL_CERTIFIED",
      totalTkdnPct: averageTkdn,
      summaryVerdict: hasViolation
        ? "Terdeteksi pelanggaran konsentrasi bahan terhadap Perka BPOM No. 17/2022. Wajib dilakukan penyesuaian dosis sebelum melanjutkan registrasi."
        : hasWarning
        ? "Formula memenuhi syarat dengan catatan (Conditional Approval). Beberapa bahan mendekati batas legal atau memerlukan klausul peringatan khusus pada etiket."
        : "Formula 100% mematuhi batas aman Perka BPOM No. 17/2022, lolos kriteria Halal HAS 23000, dan melampaui target TKDN Kemenperin.",
      ingredientsAudit: auditedIngredients,
      llmReasoning: {
        toxicologyEvaluation:
          "Seluruh bahan aktif dan eksipien berada pada rentang konsentrasi Margin of Safety (MoS > 100). Sistem emulsi non-ionik yang digunakan aman untuk aplikasi topikal berulang tanpa memicu sitotoksisitas pada keratinosit kulit.",
        mandatoryLabelWarnings: [
          "Hindari kontak langsung dengan mata. Jika terkena, bilas segera dengan air bersih mengalir.",
          "Hentikan pemakaian jika timbul reaksi alergi, kemerahan, atau rasa terbakar pada kulit.",
          ...(auditedIngredients.some((i) => i.inci.toLowerCase().includes("methoxycinnamate"))
            ? ["Jangan berada terlalu lama di bawah sinar matahari langsung, meskipun telah menggunakan tabir surya."]
            : []),
        ],
        localSubstitutionRecommendations: [
          {
            currentIngredient: "Mineral Oil / Paraffinum Liquidum (Impor)",
            recommendedLocal: "Virgin Coconut Oil (VCO Riau)",
            tkdnImpact: "+12.0% TKDN",
            rationale:
              "Substitusi hidrokarbon fosil impor dengan trigliserida rantai sedang (asam laurat C12) lokal. Memberikan profil sensori lembut alami, meningkatkan skor TKDN sediaan, dan bersertifikat 100% halal nabati.",
          },
          {
            currentIngredient: "Synthetic Madecassoside",
            recommendedLocal: "Ekstrak Centella Asiatica (Pegagan Jawa Barat)",
            tkdnImpact: "+6.5% TKDN",
            rationale:
              "Ekstrak herbal lokal kaya asiatikosida dengan aktivitas anti-inflamasi setara zat murni sintetis impor namun dengan efisiensi biaya bahan baku (COGS) lebih optimal.",
          },
        ],
      },
      evaluatedAt: new Date().toISOString(),
    };
  }

  async askRagKnowledge(query: string, categoryContext?: string): Promise<RagChatMessage> {
    // Simulated RAG retrieval + LLM synthesis: ~500ms
    await new Promise((r) => setTimeout(r, 500));

    const lower = query.toLowerCase();

    if (lower.includes("arbutin")) {
      return {
        id: `msg_${Date.now()}`,
        sender: "assistant",
        text: "Berdasarkan Peraturan BPOM No. 17 Tahun 2022 Lampiran II (Bahan dengan Pembatasan Kadar), **Alpha-Arbutin** diizinkan hingga konsentrasi maksimum **2,0%** untuk produk perawatan wajah tanpa bilas (leave-on). Kombinasi dengan Niacinamide atau antioksidan aman dan diperbolehkan secara hukum, asalkan pH sediaan dijaga stabil (pH 5.0–6.5) guna mencegah degradasi hidrokuinon bebas yang dilarang keras.",
        citations: [
          {
            document: "Peraturan BPOM No. 17/2022",
            clause: "Lampiran II Entri No. 7",
            text: "Alpha-Arbutin: Kadar maksimum 2,0% dalam sediaan kosmetik perawatan wajah.",
          },
        ],
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
    }

    if (lower.includes("phenoxyethanol") || lower.includes("pengawet")) {
      return {
        id: `msg_${Date.now()}`,
        sender: "assistant",
        text: "Berdasarkan Lampiran V Perka BPOM No. 17/2022 (Bahan Pengawet yang Diizinkan), **Phenoxyethanol** diperbolehkan dengan batas maksimum mutlak **1,0%**. Penggunaannya umum dikombinasikan dengan Ethylhexylglycerin (0,1%–0,2%) sebagai pendorong aktivitas antimikroba broad-spectrum yang bersertifikat Halal.",
        citations: [
          {
            document: "Peraturan BPOM No. 17/2022",
            clause: "Lampiran V Entri No. 29",
            text: "Phenoxyethanol: Batas aman 1,0% pada sediaan kosmetik siap pakai.",
          },
        ],
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };
    }

    return {
      id: `msg_${Date.now()}`,
      sender: "assistant",
      text: "Pertanyaan Anda telah diaudit terhadap basis pengetahuan Vector RAG Perka BPOM No. 17/2022, Sistem Jaminan Halal HAS 23000, dan Pedoman TKDN Kemenperin. Seluruh bahan dalam formulasi wajib mematuhi batas konsentrasi aman dan menggunakan bahan baku yang tersertifikasi bebas dari titik kritis kontaminasi porcine/khamr.",
      citations: [
        {
          document: "Peraturan BPOM No. 17/2022",
          clause: "Pasal 4 & Lampiran I-V",
          text: "Ketentuan teknis bahan kosmetik, batas kadar, dan pelabelan resmi Republik Indonesia.",
        },
      ],
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };
  }
}
