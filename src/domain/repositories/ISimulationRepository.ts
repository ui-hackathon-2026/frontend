import {
  SimulationRequest,
  SimulationResult,
  PresetFormulaItem,
} from "../models/simulation";

export interface ISimulationRepository {
  /**
   * Run in-silico stability and physicochemical simulation
   */
  simulateStability(request: SimulationRequest): Promise<SimulationResult>;

  /**
   * Fetch a previously recorded simulation run by its ID
   */
  getSimulationRun(runId: string): Promise<SimulationResult | null>;

  /**
   * Get default benchmark preset formulas for instant scientific demonstration
   */
  getPresetFormulas(): Promise<PresetFormulaItem[]>;
}
