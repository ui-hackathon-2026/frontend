# Original User Request

## 2026-09-11T13:41:02Z

# Teamwork Project Prompt

> Requested team: Full team (Research, Systems Architecture, and Technical Writing)

Conduct research on cheminformatics dataset readiness and Lintasarta AI platform compliance, document the findings in markdown files within `explorations/`, and produce an updated, highly competitive proposal for the PT Paragon Hackathon UI 2026 challenge.

Working directory: d:/Projects/Web Shi/UI Hackathon/explorations
Integrity mode: development

## Requirements

### R1. Dataset Readiness & Feasibility Research
Investigate open-access cosmetic and pharmaceutical formulation datasets (e.g., SEDDS/SNEDDS PMC10733404, AqSolDB, ChEMBL, TDC) and Python cheminformatics libraries (RDKit, Morgan Fingerprints). Document actionable data schemas, feature extraction pipelines, and a fast surrogate ML model strategy (e.g., Tabular LightGBM / Bayesian Optimization) feasible for a 24-hour hackathon MVP. Save the findings to `explorations/dataset_readiness_and_ml_pipeline.md`.

### R2. Lintasarta AI Pipeline & Architecture Compliance Validation
Analyze PT Aplikanusa Lintasarta's AI offerings (Cloudeka GPU Cloud, AI Studio/Sovereign LLMs) and map out how the Formulation Co-Pilot architecture integrates with Lintasarta's infrastructure to strictly satisfy the hackathon requirement ("Hanya platform AI Lintasarta yang diperkenankan"). Specify the division of labor between Lintasarta AI (e.g., conversational reasoning, formulation assistant, regulatory compliance check) and local/cloud deterministic engines. Save this analysis to `explorations/lintasarta_ai_integration_strategy.md`.

### R3. Proposal Refinement & Standardization
Synthesize the research and existing market explorations into an updated, complete `PROPOSAL STARTUP AI-DRIVEN FORMULATION CO-PILOT.md` (or a dedicated v2 document if preserving the original). Ensure it includes:
- Missing Section 1: Executive Summary & Multidisciplinary Team Structure (Technical & Business per Hackathon UI guideline).
- Clear separation between the 24-Hour Hackathon MVP scope (feasible, demonstrable) and the Long-term Startup Roadmap.
- Seamless narrative addressing PT Paragon's pain points (tropical stability at 40°C, Halal/BPOM, and local raw materials/TKDN).
- Complete index linking all supporting markdown research files in `explorations/`.

## Acceptance Criteria

### Content & Technical Rigor
- [ ] `explorations/dataset_readiness_and_ml_pipeline.md` provides explicit dataset links/sources, target feature columns, sample SMILES/fingerprint handling, and an MVP ML training workflow suitable for a 24-hour sprint.
- [ ] `explorations/lintasarta_ai_integration_strategy.md` provides an end-to-end architecture diagram and data-flow narrative demonstrating direct utilization of Lintasarta AI infrastructure.
- [ ] Proposal document has complete numbering (starting from Section 1: Executive Summary & Team Structure), includes 24h MVP vs. Roadmap boundaries, and explicitly addresses PT Paragon's evaluation criteria.
- [ ] All generated markdown files in `explorations/` follow clean GitHub-flavored markdown with cross-references and clear headings.
