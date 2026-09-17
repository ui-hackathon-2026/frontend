import { ISimulationRepository } from "@/domain/repositories/ISimulationRepository";
import {
  SimulationRequest,
  SimulationResult,
  PresetFormulaItem,
} from "@/domain/models/simulation";
import { ApiClient } from "../api/api-client";
import {
  SimulationRequestDto,
  SimulationResponseDto,
} from "../dto/simulation.dto";
import { MockSimulationRepository } from "./MockSimulationRepository";

export class HttpSimulationRepository implements ISimulationRepository {
  private apiClient: ApiClient;
  private fallbackMock: MockSimulationRepository;

  constructor(apiClient?: ApiClient) {
    this.apiClient = apiClient || new ApiClient();
    this.fallbackMock = new MockSimulationRepository();
  }

  async simulateStability(request: SimulationRequest): Promise<SimulationResult> {
    const dto: SimulationRequestDto = {
      formula_id: request.formulaId,
      formula_name: request.formulaName,
      temperature_c: request.temperatureC,
      duration_days: request.durationDays,
      engine: request.engine,
      ingredients: request.ingredients.map((i) => ({
        name: i.name,
        inci: i.inci,
        smiles: i.smiles,
        weight_pct: i.weightPct,
        phase: i.phase,
        hlb: i.hlb,
        role: i.role,
      })),
    };

    try {
      const response = await this.apiClient.post<
        SimulationRequestDto,
        SimulationResponseDto
      >("/api/v1/simulate/stability", dto);

      return this.mapDtoToDomain(response);
    } catch (error) {
      console.warn(
        "HttpSimulationRepository failed to reach backend endpoint, falling back to mock engine:",
        error
      );
      return this.fallbackMock.simulateStability(request);
    }
  }

  async getSimulationRun(runId: string): Promise<SimulationResult | null> {
    try {
      const response = await this.apiClient.get<SimulationResponseDto>(
        `/api/v1/simulate/stability/${runId}`
      );
      return this.mapDtoToDomain(response);
    } catch {
      return this.fallbackMock.getSimulationRun(runId);
    }
  }

  async getPresetFormulas(): Promise<PresetFormulaItem[]> {
    return this.fallbackMock.getPresetFormulas();
  }

  private mapDtoToDomain(dto: SimulationResponseDto): SimulationResult {
    return {
      runId: dto.run_id,
      formulaId: dto.formula_id,
      formulaName: dto.formula_name,
      temperatureC: dto.temperature_c,
      durationDays: dto.duration_days,
      engineUsed: dto.engine_used,
      inferenceDurationMs: dto.inference_duration_ms,
      createdAt: dto.created_at,
      stabilityScore: dto.stability_score_40c_90days,
      verdict: dto.verdict,
      confidenceScore: dto.confidence_score,
      isOutOfDistribution: dto.is_out_of_distribution,
      oodMahalanobisDistance: dto.ood_mahalanobis_distance,
      dynamicViscosityMpaS: dto.dynamic_viscosity_mpas,
      targetViscosityMpaS: dto.target_viscosity_mpas,
      meanDropletSizeNm: dto.mean_droplet_size_nm,
      polydispersityIndexPdi: dto.polydispersity_index_pdi,
      dropletDistribution: dto.droplet_distribution.map((d) => ({
        diameterNm: d.diameter_nm,
        volumeFrequencyPct: d.volume_frequency_pct,
      })),
      rheologyCurve: dto.rheology_curve.map((r) => ({
        shearRateS1: r.shear_rate_s1,
        viscosityMpaS: r.viscosity_mpas,
      })),
      thermodynamics: {
        deltaHlb: dto.thermodynamics.delta_hlb,
        sorRatio: dto.thermodynamics.sor_ratio,
        packingParameterP: dto.thermodynamics.packing_parameter_p,
        gibbsFreeEnergyKjMol: dto.thermodynamics.gibbs_free_energy_kj_mol,
        criticalMicelleConcentrationMmolL:
          dto.thermodynamics.critical_micelle_concentration_mmol_l,
        interfaceState: dto.thermodynamics
          .interface_state as SimulationResult["thermodynamics"]["interfaceState"],
      },
      riskFactors: dto.risk_factors,
      stabilizingFactors: dto.stabilizing_factors,
      recommendations: dto.recommendations,
    };
  }
}
