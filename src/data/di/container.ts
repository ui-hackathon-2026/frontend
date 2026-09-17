import { ISimulationRepository } from "@/domain/repositories/ISimulationRepository";
import { IWorkbenchRepository } from "@/domain/repositories/IWorkbenchRepository";
import { IComplianceRepository } from "@/domain/repositories/IComplianceRepository";
import { MockSimulationRepository } from "../repositories/MockSimulationRepository";
import { HttpSimulationRepository } from "../repositories/HttpSimulationRepository";
import { MockWorkbenchRepository } from "../repositories/MockWorkbenchRepository";
import { HttpWorkbenchRepository } from "../repositories/HttpWorkbenchRepository";
import { MockComplianceRepository } from "../repositories/MockComplianceRepository";
import { HttpComplianceRepository } from "../repositories/HttpComplianceRepository";

import { IBriefRepository } from "@/domain/repositories/IBriefRepository";
import { MockBriefRepository } from "../repositories/MockBriefRepository";
import { HttpBriefRepository } from "../repositories/HttpBriefRepository";

import { IOptimizerRepository } from "@/domain/repositories/IOptimizerRepository";
import { MockOptimizerRepository } from "../repositories/MockOptimizerRepository";
import { HttpOptimizerRepository } from "../repositories/HttpOptimizerRepository";

class ServiceContainer {
  private static simulationRepository: ISimulationRepository | null = null;
  private static workbenchRepository: IWorkbenchRepository | null = null;
  private static complianceRepository: IComplianceRepository | null = null;
  private static briefRepository: IBriefRepository | null = null;
  private static optimizerRepository: IOptimizerRepository | null = null;

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

  public static getComplianceRepository(): IComplianceRepository {
    if (!this.complianceRepository) {
      const useMock =
        process.env.NEXT_PUBLIC_USE_MOCK_API === "true" ||
        process.env.NODE_ENV === "development" ||
        !process.env.NEXT_PUBLIC_BACKEND_URL;

      if (useMock) {
        this.complianceRepository = new MockComplianceRepository();
      } else {
        this.complianceRepository = new HttpComplianceRepository();
      }
    }
    return this.complianceRepository!;
  }

  public static getBriefRepository(): IBriefRepository {
    if (!this.briefRepository) {
      const useMock =
        process.env.NEXT_PUBLIC_USE_MOCK_API === "true" ||
        process.env.NODE_ENV === "development" ||
        !process.env.NEXT_PUBLIC_BACKEND_URL;

      if (useMock) {
        this.briefRepository = new MockBriefRepository();
      } else {
        this.briefRepository = new HttpBriefRepository();
      }
    }
    return this.briefRepository!;
  }

  public static getOptimizerRepository(): IOptimizerRepository {
    if (!this.optimizerRepository) {
      const useMock =
        process.env.NEXT_PUBLIC_USE_MOCK_API === "true" ||
        process.env.NODE_ENV === "development" ||
        !process.env.NEXT_PUBLIC_BACKEND_URL;

      if (useMock) {
        this.optimizerRepository = new MockOptimizerRepository();
      } else {
        this.optimizerRepository = new HttpOptimizerRepository();
      }
    }
    return this.optimizerRepository!;
  }

  public static setComplianceRepository(repo: IComplianceRepository) {
    this.complianceRepository = repo;
  }
}

export const getSimulationRepository = () => ServiceContainer.getSimulationRepository();
export const getWorkbenchRepository = () => ServiceContainer.getWorkbenchRepository();
export const getComplianceRepository = () => ServiceContainer.getComplianceRepository();
export const getBriefRepository = () => ServiceContainer.getBriefRepository();
export const getOptimizerRepository = () => ServiceContainer.getOptimizerRepository();

