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

import { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import { IFormulaRepository } from "@/domain/repositories/IFormulaRepository";
import { MockFormulaRepository } from "../repositories/MockFormulaRepository";
import { HttpFormulaRepository } from "../repositories/HttpFormulaRepository";
import { MockAuthRepository } from "../repositories/MockAuthRepository";
import { HttpAuthRepository } from "../repositories/HttpAuthRepository";

function shouldUseMockApi(): boolean {
  if (process.env.NEXT_PUBLIC_USE_MOCK_API === "false") return false;
  return (
    process.env.NEXT_PUBLIC_USE_MOCK_API === "true" ||
    process.env.NODE_ENV === "development" ||
    !process.env.NEXT_PUBLIC_BACKEND_URL
  );
}

class ServiceContainer {
  private static simulationRepository: ISimulationRepository | null = null;
  private static workbenchRepository: IWorkbenchRepository | null = null;
  private static complianceRepository: IComplianceRepository | null = null;
  private static briefRepository: IBriefRepository | null = null;
  private static optimizerRepository: IOptimizerRepository | null = null;
  private static authRepository: IAuthRepository | null = null;
  private static formulaRepository: IFormulaRepository | null = null;

  public static getSimulationRepository(): ISimulationRepository {
    if (!this.simulationRepository) {
      const useMock = shouldUseMockApi();

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
      const useMock = shouldUseMockApi();

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
      const useMock = shouldUseMockApi();

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
      const useMock = shouldUseMockApi();

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
      const useMock = shouldUseMockApi();

      if (useMock) {
        this.optimizerRepository = new MockOptimizerRepository();
      } else {
        this.optimizerRepository = new HttpOptimizerRepository();
      }
    }
    return this.optimizerRepository!;
  }

  public static getAuthRepository(): IAuthRepository {
    if (!this.authRepository) {
      const useMock = shouldUseMockApi();

      if (useMock) {
        this.authRepository = new MockAuthRepository();
      } else {
        this.authRepository = new HttpAuthRepository();
      }
    }
    return this.authRepository!;
  }

  public static getFormulaRepository(): IFormulaRepository {
    if (!this.formulaRepository) {
      const useMock = shouldUseMockApi();

      if (useMock) {
        this.formulaRepository = new MockFormulaRepository();
      } else {
        this.formulaRepository = new HttpFormulaRepository();
      }
    }
    return this.formulaRepository!;
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
export const getAuthRepository = () => ServiceContainer.getAuthRepository();
export const getFormulaRepository = () => ServiceContainer.getFormulaRepository();


