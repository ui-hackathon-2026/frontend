import { ISimulationRepository } from "@/domain/repositories/ISimulationRepository";
import { IWorkbenchRepository } from "@/domain/repositories/IWorkbenchRepository";
import { MockSimulationRepository } from "../repositories/MockSimulationRepository";
import { HttpSimulationRepository } from "../repositories/HttpSimulationRepository";
import { MockWorkbenchRepository } from "../repositories/MockWorkbenchRepository";
import { HttpWorkbenchRepository } from "../repositories/HttpWorkbenchRepository";

class ServiceContainer {
  private static simulationRepository: ISimulationRepository | null = null;
  private static workbenchRepository: IWorkbenchRepository | null = null;

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

  public static getWorkbenchRepository(): IWorkbenchRepository {
    if (!this.workbenchRepository) {
      const useMock =
        process.env.NEXT_PUBLIC_USE_MOCK_API === "true" ||
        process.env.NODE_ENV === "development" ||
        !process.env.NEXT_PUBLIC_BACKEND_URL;

      if (useMock) {
        this.workbenchRepository = new MockWorkbenchRepository();
      } else {
        this.workbenchRepository = new HttpWorkbenchRepository();
      }
    }
    return this.workbenchRepository!;
  }

  public static setWorkbenchRepository(repo: IWorkbenchRepository) {
    this.workbenchRepository = repo;
  }
}

export const getSimulationRepository = () => ServiceContainer.getSimulationRepository();
export const getWorkbenchRepository = () => ServiceContainer.getWorkbenchRepository();
