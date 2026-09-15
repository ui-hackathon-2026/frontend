# Dispatch Log

## 2026-09-11T13:47:21Z

From: parent (18d03100-7080-4310-a9d3-4d13cc2ef3d3)
To: teamwork_preview_worker_1 (Role: Cheminformatics Technical Writer & Worker)

Assignment:
Author the complete, authoritative, publication-grade research deliverable:
`d:/Projects/Web Shi/UI Hackathon/explorations/dataset_readiness_and_ml_pipeline.md`

Exclusive File Ownership:
`d:/Projects/Web Shi/UI Hackathon/explorations/dataset_readiness_and_ml_pipeline.md`

Mandatory Input Files:
- Authoritative User Request: d:/Projects/Web Shi/UI Hackathon/.agents/ORIGINAL_REQUEST.md
- Project Scope: d:/Projects/Web Shi/UI Hackathon/.agents/teamwork_preview_orchestrator_1/PROJECT.md
- Comprehensive Research Analysis: d:/Projects/Web Shi/UI Hackathon/.agents/teamwork_preview_explorer_r1/analysis.md
- Research Handoff: d:/Projects/Web Shi/UI Hackathon/.agents/teamwork_preview_explorer_r1/handoff.md

Detailed Requirements:
1. Executive Summary: Core thesis, methodology, and 24-hour hackathon execution strategy.
2. Open-Access Datasets Audit:
   - Comprehensive table of open datasets: SEDDS/SNEDDS PMC10733404 (Zaslavsky & Allen 2023, OSF osf.io/hvefk, CC BY 4.0), AqSolDB (Sorkun et al. 2019, CC BY 4.0), Therapeutics Data Commons (TDC / PyTDC), ChEMBL 33/34 formulations, FDA IID excipients, and EU CosIng / BPOM regulatory thresholds.
   - Direct download URLs, DOIs, licenses, record counts, and ready-to-run Python/curl automated ingestion snippets.
3. Formulation Data Schema Specification:
   - Complete Relational SQL Schema (formulation_master, formulation_ingredients, formulation_targets, raw_materials_catalog).
   - 1,054-dimensional denormalized ML feature vector schema covering PT Paragon target variables: 90-day 40°C / 75% RH tropical stability index (Zone IVb ASEAN/BPOM), dynamic viscosity (cP), droplet size (nm), PDI, and sensory hedonic scores.
4. Cheminformatics & Feature Engineering Pipeline:
   - Molecular standardization, canonical SMILES, RDKit 1024-bit Morgan circular fingerprints (ECFP4), and 2D physicochemical descriptors.
   - Hybrid mixture featurization: Weighted-sum fingerprint pooling (sum w_i f_i) combined with colloid interaction terms (delta HLB, Emulsifier-to-Oil Ratio, shear rate).
   - Complete, executable, production-quality Python class FormulationFeaturizer using RDKit and NumPy.
5. Fast Surrogate ML & Optimization Workflow for 24h Hackathon:
   - Multi-task LightGBM surrogate architecture (< 5s training time on CPU/GPU, < 2ms inference, native handling of missing measurements).
   - Optuna Bayesian optimization with NSGA-II multi-objective Pareto optimization, Dirichlet simplex projection (mass conservation sum w_i = 100%), and hard regulatory boundary enforcement (BPOM preservative ceilings, TKDN local Indonesian oil maximization >= 40%). Complete runnable code.
   - GroupKFold chemical scaffold cross-validation and Quantile Regression uncertainty intervals (90% CI).
6. 24-Hour Hackathon Engineering Roadmap:
   - Hour-by-hour execution schedule (T+0 to T+24) demonstrating feasibility for the hackathon MVP.
