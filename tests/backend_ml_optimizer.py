"""
Extracted FastFormulationOptimizer from explorations/dataset_readiness_and_ml_pipeline.md
Section 5.6
"""

import sys
import logging
import numpy as np
from typing import Dict, Any, List, Tuple

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("FormulationOptimizer")

try:
    import optuna
    OPTUNA_AVAILABLE = True
except ImportError:
    OPTUNA_AVAILABLE = False
    logger.warning("Optuna not installed in Python environment. Simulation mode active.")


class FastFormulationOptimizer:
    """
    Executes multi-objective Bayesian optimization over cosmetic recipe space.
    Enforces Dirichlet Simplex Projection (sum w_i = 100%) and BPOM safety boundaries.
    """

    def __init__(self, target_viscosity_cps: float = 4500.0, min_tkdn_pct: float = 40.0):
        self.target_viscosity_cps = target_viscosity_cps
        self.min_tkdn_pct = min_tkdn_pct

    def evaluate_surrogate(self, weights: np.ndarray) -> Tuple[float, float, float, float]:
        """
        Fast surrogate simulation of physical formulation properties.
        Args:
            weights: [w_water, w_vco, w_caprylic, w_emulsifier, w_glycerin, w_niacinamide, w_preservative]
        Returns:
            (stability_prob, viscosity_error, droplet_size_nm, tkdn_pct)
        """
        w_water, w_vco, w_caprylic, w_emulsifier, w_glycerin, w_niacinamide, w_preservative = weights
        
        # Total oil phase
        w_oil = w_vco + w_caprylic
        
        # Bancroft HLB / Colloid stability surrogate physics
        # Emulsifier to oil ratio optimum around 0.30 - 0.40
        eor = w_emulsifier / (w_oil + 1e-6)
        eor_penalty = abs(eor - 0.35)
        
        # Stability probability (diminishes if eor is off or active exceeds solubility)
        stability_prob = 0.96 - 0.25 * eor_penalty - (0.05 if w_niacinamide > 3.0 else 0.0)
        stability_prob = float(np.clip(stability_prob, 0.05, 0.99))
        
        # Dynamic viscosity surrogate (in cP)
        pred_viscosity = 800.0 + (w_emulsifier * 450.0) + (w_glycerin * 180.0) + (w_oil * 60.0)
        viscosity_error = float(abs(pred_viscosity - self.target_viscosity_cps))
        
        # Droplet size (nm): high shear + optimal emulsifier yields < 150nm nano-emulsion
        droplet_size_nm = float(80.0 + 350.0 * eor_penalty + 50.0 * (1.0 / (w_emulsifier + 1e-3)))
        
        # Indonesian TKDN score: Local Virgin Coconut Oil (VCO) + Local Glycerin
        tkdn_pct = float(w_vco + w_glycerin)
        
        return stability_prob, viscosity_error, droplet_size_nm, tkdn_pct

    def run_optimization(self, n_trials: int = 150, timeout_sec: int = 20) -> List[Dict[str, Any]]:
        """
        Runs Optuna NSGA-II multi-objective Pareto optimization.
        """
        if not OPTUNA_AVAILABLE:
            logger.info("Running deterministic grid-sampling fallback...")
            results = []
            for vco in [5.0, 10.0, 15.0]:
                for emul in [3.0, 4.5, 6.0]:
                    raw = np.array([70.0, vco, 8.0, emul, 5.0, 2.5, 0.9])
                    norm = (raw / np.sum(raw)) * 100.0
                    stab, visc_err, d_nm, tkdn = self.evaluate_surrogate(norm)
                    results.append({"weights": norm.tolist(), "stability": stab, "viscosity_err": visc_err, "droplet_nm": d_nm, "tkdn": tkdn})
            return results

        def objective(trial: optuna.Trial):
            # 1. Sample unconstrained logits for raw materials
            # Sampling boundaries adjusted to mathematically permit TKDN >= 40% (e.g. rich creams & barrier balms)
            z_water = trial.suggest_float("z_water", 40.0, 75.0)
            z_vco = trial.suggest_float("z_vco_tkdn", 5.0, 35.0)         # Indonesian Virgin Coconut Oil
            z_caprylic = trial.suggest_float("z_caprylic", 0.0, 10.0)
            z_emulsifier = trial.suggest_float("z_emulsifier", 2.5, 8.0)
            z_glycerin = trial.suggest_float("z_glycerin", 3.0, 15.0)    # Local Palm-derived humectant
            z_niacinamide = trial.suggest_float("z_niacinamide", 1.0, 5.0) # Active
            z_preservative = trial.suggest_float("z_preservative", 0.4, 1.2) # Phenoxyethanol

            # 2. Dirichlet Simplex Projection (Guarantee exact sum = 100.0%)
            raw_vec = np.array([z_water, z_vco, z_caprylic, z_emulsifier, z_glycerin, z_niacinamide, z_preservative])
            norm_weights = (raw_vec / np.sum(raw_vec)) * 100.0

            w_water, w_vco, w_caprylic, w_emul, w_glyc, w_niac, w_pres = norm_weights

            # 3. Hard Regulatory & Mandate Penalty Checks
            if w_pres > 1.00:  # BPOM Annex V
                return 0.0, 99999.0, 9999.0, 0.0
            if w_niac > 5.00:  # BPOM OTC Active
                return 0.0, 99999.0, 9999.0, 0.0
            if w_emul < 2.50:  # Coalescence barrier
                return 0.0, 99999.0, 9999.0, 0.0

            # Enforce self.min_tkdn_pct constraint (default 40.0%)
            tkdn = float(w_vco + w_glyc)
            if tkdn < self.min_tkdn_pct:
                return 0.0, 99999.0, 9999.0, tkdn

            # 4. Evaluate physical surrogate endpoints
            stab, visc_err, d_nm, tkdn = self.evaluate_surrogate(norm_weights)

            # Return multi-objective targets:
            # [Maximize Stability, Minimize Viscosity Error, Minimize Droplet Size, Maximize TKDN]
            return stab, visc_err, d_nm, tkdn

        optuna.logging.set_verbosity(optuna.logging.WARNING)
        sampler = optuna.samplers.NSGAIISampler(seed=42)
        study = optuna.create_study(
            directions=["maximize", "minimize", "minimize", "maximize"],
            sampler=sampler
        )
        study.optimize(objective, n_trials=n_trials, timeout=timeout_sec)

        logger.info(f"Optimization completed. Total trials: {len(study.trials)}")
        logger.info(f"Pareto optimal frontier candidates found: {len(study.best_trials)}")

        pareto_recipes = []
        for t in study.best_trials:
            raw_v = np.array([t.params[k] for k in ["z_water", "z_vco_tkdn", "z_caprylic", "z_emulsifier", "z_glycerin", "z_niacinamide", "z_preservative"]])
            norm_v = (raw_v / np.sum(raw_v)) * 100.0
            pareto_recipes.append({
                "trial_id": t.number,
                "weights_percent": {
                    "Water": round(norm_v[0], 2),
                    "VCO_Indonesian_TKDN": round(norm_v[1], 2),
                    "Caprylic_Triglyceride": round(norm_v[2], 2),
                    "Emulsifier_Blend": round(norm_v[3], 2),
                    "Glycerin_TKDN": round(norm_v[4], 2),
                    "Niacinamide": round(norm_v[5], 2),
                    "Phenoxyethanol": round(norm_v[6], 2)
                },
                "total_weight_check": round(float(np.sum(norm_v)), 2),
                "predicted_tropical_stability": round(t.values[0], 3),
                "viscosity_error_cps": round(t.values[1], 1),
                "droplet_size_nm": round(t.values[2], 1),
                "tkdn_percentage": round(t.values[3], 2)
            })
        return pareto_recipes
