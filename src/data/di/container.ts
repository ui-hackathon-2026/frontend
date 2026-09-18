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

import { IWorkspaceRepository } from "@/domain/repositories/IWorkspaceRepository";
import { MockWorkspaceRepository } from "../repositories/MockWorkspaceRepository";
import { HttpWorkspaceRepository } from "../repositories/HttpWorkspaceRepository";

import { ISimilarityRepository } from "@/domain/repositories/ISimilarityRepository";
import { MockSimilarityRepository } from "../repositories/MockSimilarityRepository";
import { HttpSimilarityRepository } from "../repositories/HttpSimilarityRepository";

export function isDemoMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (localStorage.getItem("ps_demo_mode") === "true") return true;
    const userStr = localStorage.getItem("ps_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user?.email?.toLowerCase() === "demo@paragon.co.id") return true;
    }
  } catch {}
  return false;
}

function shouldUseMockApi(): boolean {
  if (isDemoMode()) return true;
  if (process.env.NEXT_PUBLIC_USE_MOCK_API === "false") return false;
  return (
    process.env.NEXT_PUBLIC_USE_MOCK_API === "true" ||
    process.env.NODE_ENV === "development" ||
    !process.env.NEXT_PUBLIC_BACKEND_URL
  );
}

class ServiceContainer {
  private static mockSimulationRepository: ISimulationRepository | null = null;
  private static httpSimulationRepository: ISimulationRepository | null = null;

  private static mockWorkbenchRepository: IWorkbenchRepository | null = null;
  private static httpWorkbenchRepository: IWorkbenchRepository | null = null;

  private static mockComplianceRepository: IComplianceRepository | null = null;
  private static httpComplianceRepository: IComplianceRepository | null = null;

  private static mockBriefRepository: IBriefRepository | null = null;
  private static httpBriefRepository: IBriefRepository | null = null;

  private static mockOptimizerRepository: IOptimizerRepository | null = null;
  private static httpOptimizerRepository: IOptimizerRepository | null = null;

  private static mockAuthRepository: IAuthRepository | null = null;
  private static httpAuthRepository: IAuthRepository | null = null;

  private static mockFormulaRepository: IFormulaRepository | null = null;
  private static httpFormulaRepository: IFormulaRepository | null = null;

  private static mockWorkspaceRepository: IWorkspaceRepository | null = null;
  private static httpWorkspaceRepository: IWorkspaceRepository | null = null;

  private static mockSimilarityRepository: ISimilarityRepository | null = null;
  private static httpSimilarityRepository: ISimilarityRepository | null = null;

  public static getSimulationRepository(): ISimulationRepository {
    if (shouldUseMockApi()) {
      if (!this.mockSimulationRepository) {
        this.mockSimulationRepository = new MockSimulationRepository();
      }
      return this.mockSimulationRepository;
    }
    if (!this.httpSimulationRepository) {
      this.httpSimulationRepository = new HttpSimulationRepository();
    }
    return this.httpSimulationRepository;
  }

  public static getWorkbenchRepository(): IWorkbenchRepository {
    if (shouldUseMockApi()) {
      if (!this.mockWorkbenchRepository) {
        this.mockWorkbenchRepository = new MockWorkbenchRepository();
      }
      return this.mockWorkbenchRepository;
    }
    if (!this.httpWorkbenchRepository) {
      this.httpWorkbenchRepository = new HttpWorkbenchRepository();
    }
    return this.httpWorkbenchRepository;
  }

  public static getComplianceRepository(): IComplianceRepository {
    if (shouldUseMockApi()) {
      if (!this.mockComplianceRepository) {
        this.mockComplianceRepository = new MockComplianceRepository();
      }
      return this.mockComplianceRepository;
    }
    if (!this.httpComplianceRepository) {
      this.httpComplianceRepository = new HttpComplianceRepository();
    }
    return this.httpComplianceRepository;
  }

  public static getBriefRepository(): IBriefRepository {
    if (shouldUseMockApi()) {
      if (!this.mockBriefRepository) {
        this.mockBriefRepository = new MockBriefRepository();
      }
      return this.mockBriefRepository;
    }
    if (!this.httpBriefRepository) {
      this.httpBriefRepository = new HttpBriefRepository();
    }
    return this.httpBriefRepository;
  }

  public static getOptimizerRepository(): IOptimizerRepository {
    if (shouldUseMockApi()) {
      if (!this.mockOptimizerRepository) {
        this.mockOptimizerRepository = new MockOptimizerRepository();
      }
      return this.mockOptimizerRepository;
    }
    if (!this.httpOptimizerRepository) {
      this.httpOptimizerRepository = new HttpOptimizerRepository();
    }
    return this.httpOptimizerRepository;
  }

  public static getAuthRepository(): IAuthRepository {
    if (shouldUseMockApi()) {
      if (!this.mockAuthRepository) {
        this.mockAuthRepository = new MockAuthRepository();
      }
      return this.mockAuthRepository;
    }
    if (!this.httpAuthRepository) {
      this.httpAuthRepository = new HttpAuthRepository();
    }
    return this.httpAuthRepository;
  }

  public static getFormulaRepository(): IFormulaRepository {
    if (shouldUseMockApi()) {
      if (!this.mockFormulaRepository) {
        this.mockFormulaRepository = new MockFormulaRepository();
      }
      return this.mockFormulaRepository;
    }
    if (!this.httpFormulaRepository) {
      this.httpFormulaRepository = new HttpFormulaRepository();
    }
    return this.httpFormulaRepository;
  }

  public static getWorkspaceRepository(): IWorkspaceRepository {
    if (shouldUseMockApi()) {
      if (!this.mockWorkspaceRepository) {
        this.mockWorkspaceRepository = new MockWorkspaceRepository();
      }
      return this.mockWorkspaceRepository;
    }
    if (!this.httpWorkspaceRepository) {
      this.httpWorkspaceRepository = new HttpWorkspaceRepository();
    }
    return this.httpWorkspaceRepository;
  }

  public static getSimilarityRepository(): ISimilarityRepository {
    if (shouldUseMockApi()) {
      if (!this.mockSimilarityRepository) {
        this.mockSimilarityRepository = new MockSimilarityRepository();
      }
      return this.mockSimilarityRepository;
    }
    if (!this.httpSimilarityRepository) {
      this.httpSimilarityRepository = new HttpSimilarityRepository();
    }
    return this.httpSimilarityRepository;
  }

  public static setComplianceRepository(repo: IComplianceRepository) {
    this.mockComplianceRepository = repo;
    this.httpComplianceRepository = repo;
  }
}

export const getSimulationRepository = () => ServiceContainer.getSimulationRepository();
export const getWorkbenchRepository = () => ServiceContainer.getWorkbenchRepository();
export const getComplianceRepository = () => ServiceContainer.getComplianceRepository();
export const getBriefRepository = () => ServiceContainer.getBriefRepository();
export const getOptimizerRepository = () => ServiceContainer.getOptimizerRepository();
export const getAuthRepository = () => ServiceContainer.getAuthRepository();
export const getFormulaRepository = () => ServiceContainer.getFormulaRepository();
export const getWorkspaceRepository = () => ServiceContainer.getWorkspaceRepository();
export const getSimilarityRepository = () => ServiceContainer.getSimilarityRepository();


