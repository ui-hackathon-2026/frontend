export type ElementType = "C" | "H" | "O" | "N" | "S" | "P" | "Cl" | "Na";

export interface Atom3D {
  id: number;
  element: ElementType;
  x: number;
  y: number;
  z: number;
  charge?: number; // Partial charge for Electrostatic Potential (ESP) mapping
}

export interface Bond3D {
  source: number; // atom index
  target: number; // atom index
  order: 1 | 2 | 3; // single, double, triple
}

export interface PhysicochemicalProperties {
  formula: string;
  molecularWeight: number; // g/mol
  logP: number; // Octanol-water partition coefficient
  tpsa: number; // Topological polar surface area (Å²)
  hBondDonors: number;
  hBondAcceptors: number;
  rotatableBonds: number;
  charge: number;
  hlbRequirement?: number; // For oil/emollients or surfactants
}

export interface MoleculeItem {
  id: string;
  name: string;
  inci: string;
  category: "active" | "emulsifier" | "emollient" | "humectant" | "thickener";
  smiles: string;
  description: string;
  properties: PhysicochemicalProperties;
  atoms: Atom3D[];
  bonds: Bond3D[];
}

export interface ColloidSimulationState {
  sor: number; // Surfactant-to-Oil Ratio (0.05 to 0.40)
  oilPhaseFraction: number; // % oil phase (5% - 30%)
  lamellarLayers: number; // 1 to 5 lamellar crystal bilayers
  dropletRadiusNm: number; // 80 - 450 nm
  interfaceCurvature: "positive" | "zero" | "negative"; // O/W vs planar vs W/O
}
