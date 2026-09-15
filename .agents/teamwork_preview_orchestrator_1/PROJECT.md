# Project: PT Paragon Hackathon UI 2026 - AI-Driven Formulation Co-Pilot

## Architecture
- **Layer 1: User Experience & Formulation Workbench** — Interactive Next.js 14 web canvas for formulation chemists to input target properties, raw materials, and constraints.
- **Layer 2: Lintasarta AI Reasoning & Domain Co-Pilot** — Powered by Lintasarta AI Studio and Sovereign LLMs (Sahabat-AI / Deka LLM Llama-3 via NVIDIA NIM hosted on Lintasarta Cloudeka GPU Cloud) for conversational formulation assistance, literature/regulatory query, and natural language explanation.
- **Layer 3: Deterministic & Surrogate ML Engine** — Fast surrogate prediction models (Multi-task LightGBM on 1,054-d tabular formulation parameters + RDKit Morgan fingerprints) coupled with Optuna NSGA-II Bayesian Optimization on Dirichlet simplex for multi-objective formulation candidate suggestion.
- **Layer 4: Indonesian Regulatory & Compliance Engine** — Deterministic rules and checks for BPOM cosmetics limits (Perka No. 17/2022), Halal certification compliance (HAS 23000), and local raw materials (TKDN >= 40%) scoring.
- **Layer 5: Infrastructure & Sovereign Cloud** — PT Aplikanusa Lintasarta Cloudeka infrastructure guaranteeing data sovereignty (UU PDP No. 27/2022, PP No. 71/2019, UU No. 30/2000 trade secrets) and full compliance with hackathon rules ("Hanya platform AI Lintasarta yang diperkenankan").

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Open-Access Formulation Datasets | Survey & specify open datasets (PMC10733404, AqSolDB, ChEMBL, TDC) for emulsions/solutions | M1 | ORIGINAL_REQUEST §R1 |
| 2 | Cheminformatics Feature Engineering | RDKit Morgan fingerprints, molecular descriptors, and mixture tabular schemas (1,054-d) | M1 | ORIGINAL_REQUEST §R1 |
| 3 | Fast Surrogate ML Workflow | LightGBM & Bayesian optimization pipeline executable within a 24-hour hackathon | M1 | ORIGINAL_REQUEST §R1 |
| 4 | Lintasarta Platform Compliance | Mapping to Cloudeka GPU Cloud & AI Studio strictly fulfilling "Hanya platform AI Lintasarta yang diperkenankan" | M2 | ORIGINAL_REQUEST §R2 |
| 5 | Division of Labor Architecture | Explicit separation between Lintasarta AI (conversational/reasoning) and local/cloud deterministic engines | M2 | ORIGINAL_REQUEST §R2 |
| 6 | End-to-End Architectural Diagrams | ASCII/Mermaid diagrams showing secure data flow and API contracts | M2 | ORIGINAL_REQUEST §R2 |
| 7 | Executive Summary & Team Structure | Full Section 1 with technical and business multidisciplinary roles per Hackathon UI guideline | M3 | ORIGINAL_REQUEST §R3 |
| 8 | 24h MVP vs. Long-term Roadmap | Clean separation between 24h hackathon deliverable and commercial startup roadmap | M3 | ORIGINAL_REQUEST §R3 |
| 9 | PT Paragon Pain Points | Targeted solutions for tropical stability (40°C / 75% RH), Halal/BPOM compliance, and TKDN local ingredients | M3 | ORIGINAL_REQUEST §R3 |
| 10 | Cross-Reference Documentation Index | Comprehensive index linking all supporting markdown files in explorations/ | M3 | ORIGINAL_REQUEST §R3 |
| 11 | Quality Review & Audit | Independent review and forensic integrity audit of all deliverables | M4 | Workflow Acceptance |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Dataset Readiness & ML Pipeline | Research and author `explorations/dataset_readiness_and_ml_pipeline.md` | none | DONE |
| 2 | M2: Lintasarta AI Integration Strategy | Research and author `explorations/lintasarta_ai_integration_strategy.md` | none | DONE |
| 3 | M3: Proposal Refinement & Standardization | Refine and author `explorations/PROPOSAL STARTUP AI-DRIVEN FORMULATION CO-PILOT.md` | M1, M2 | DONE |
| 4 | M4: Final Review, Adversarial & Audit | Comprehensive review, challenge, and forensic audit of all markdown assets | M1, M2, M3 | DONE |

## Interface Contracts
### Formulation Input Schema ↔ Surrogate ML Predictor
- Inputs: Ingredient List with CAS/SMILES, weight percentages (sum = 100%), processing temperature/shear rate.
- Outputs: Predicted viscosity, phase stability index at 40°C, droplet size distribution, sensory feel score, confidence interval.

### Formulation Assistant ↔ Lintasarta AI Studio
- Payload: Formulation draft state + user prompt + BPOM/Halal constraints.
- Response: Suggested formulation adjustments, regulatory warnings, rationale in Bahasa Indonesia / English.

## Code & Artifact Layout
- `explorations/dataset_readiness_and_ml_pipeline.md` — Milestone 1 Deliverable (Verified & Approved)
- `explorations/lintasarta_ai_integration_strategy.md` — Milestone 2 Deliverable (Verified & Approved)
- `explorations/PROPOSAL STARTUP AI-DRIVEN FORMULATION CO-PILOT.md` — Milestone 3 Deliverable (Verified & Approved)
- `explorations/guideline.md` — Hackathon UI Guideline & evaluation criteria
- `explorations/Market Sizing and Industry Data.md` — Supporting market research
- `explorations/Competitive Landscape & Positioning Matrix.md` — Supporting competitive analysis
- `explorations/Financial Projections & Unit Economics.md` — Supporting business/financial models
