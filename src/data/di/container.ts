import { ISimulationRepository } from "@/domain/repositories/ISimulationRepository";
import { MockSimulationRepository } from "../repositories/MockSimulationRepository";
import { HttpSimulationRepository } from "../repositories/HttpSimulationRepository";

class ServiceContainer {
  private static simulationRepository: ISimulationRepository | null = null;

  public static getSimulationRepository(): ISimulationRepository {
    if (!this.simulationRepository) {
      const useMock =
        process.env.NEXT_PUBLIC_USE_MOCK_API === "true" ||
        process.env.NODE_ENV === "development" ||
        !process.env.NEXT_PUBLIC_BACKEND_URL;

      if (useMock) {
        this.simulationRepository = new MockSimulationRepository();
      } else {
        this.simulationRepository = new HttpSimulationRepository();
      }
    }
    return this.simulationRepository!;
  }

  /**
   * Override repository for unit testing or custom mocks
   */
  public static setSimulationRepository(repo: ISimulationRepository) {
    this.simulationRepository = repo;
  }
}

export const getSimulationRepository = () => ServiceContainer.getSimulationRepository();
