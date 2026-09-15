"""
Deep Empirical Challenge Analysis Script for Deliverable R1
Author: teamwork_preview_challenger_1
"""

import numpy as np
import sys
import os
sys.path.insert(0, os.path.abspath("."))
sys.path.insert(0, os.path.abspath("tests"))
from backend_ml_optimizer import FastFormulationOptimizer

def run_tkdn_empirical_stress_test():
    print("==================================================")
    print("EMPIRICAL TEST 1: TKDN SAMPLING SPACE ANALYSIS")
    print("==================================================")
    opt = FastFormulationOptimizer(target_viscosity_cps=4200.0, min_tkdn_pct=40.0)
    candidates = opt.run_optimization(n_trials=300)

    tkdn_values = [c["tkdn_percentage"] for c in candidates]
    max_tkdn = max(tkdn_values)
    min_tkdn = min(tkdn_values)
    mean_tkdn = np.mean(tkdn_values)
    qualifying_count = sum(1 for v in tkdn_values if v >= 40.0)

    print(f"Total Pareto Candidates: {len(candidates)}")
    print(f"TKDN Min: {min_tkdn:.2f}% | Mean: {mean_tkdn:.2f}% | Max: {max_tkdn:.2f}%")
    print(f"Candidates meeting claimed TKDN >= 40.0%: {qualifying_count} / {len(candidates)} ({qualifying_count / len(candidates) * 100:.1f}%)")

    # Analytical Theoretical Upper Bound:
    # z_water in [60.0, 85.0]
    # z_vco_tkdn in [2.0, 20.0]
    # z_caprylic in [0.0, 10.0]
    # z_emulsifier in [2.0, 8.0]
    # z_glycerin in [2.0, 10.0]
    # z_niacinamide in [1.0, 5.0]
    # z_preservative in [0.4, 1.2]
    #
    # To maximize TKDN = (z_vco + z_glycerin) / sum(z) * 100:
    # Max numerator = 20.0 + 10.0 = 30.0
    # Min non-TKDN denominator = min(z_water) + min(z_caprylic) + min(z_emul) + min(z_niac) + min(z_pres)
    #                          = 60.0 + 0.0 + 2.0 + 1.0 + 0.4 = 63.4
    # (Note: w_emul / sum(z) * 100 must be >= 2.50 to avoid penalty:
    #  if z_emul = 2.0 and sum = 93.4, w_emul = 2.0/93.4 = 2.14% < 2.5%, so penalty triggers!)
    #  For w_emul >= 2.50% when numerator is 30.0:
    #  z_emul / (60 + 30 + z_caprylic + z_emul + 1.0 + 0.4) >= 0.025
    #  z_emul >= 0.025 * (91.4 + z_emul) -> 0.975 z_emul >= 2.285 -> z_emul >= 2.344
    #  Then min valid denominator = 60.0 + 30.0 + 0.0 + 2.344 + 1.0 + 0.4 = 93.744
    #  Theoretical max valid TKDN = 30.0 / 93.744 * 100 = 32.00%!
    theo_max = 30.0 / (60.0 + 30.0 + 0.0 + 2.344 + 1.0 + 0.4) * 100.0
    print(f"THEORETICAL MAXIMUM TKDN IN DEFINED SAMPLER SPACE: {theo_max:.2f}%")
    print(f"CRITICAL DISCREPANCY: The document claims 'Indonesian TKDN lipid ratio maximization (>= 40%)'")
    print(f"and sets self.min_tkdn_pct = 40.0, but the sampling bounds mathematically cap TKDN at {theo_max:.2f}%!")


def run_hlb_zero_truthiness_bug_test():
    print("\n==================================================")
    print("EMPIRICAL TEST 2: HLB ZERO TRUTHINESS BUG")
    print("==================================================")
    # Line 685: hlb = float(item.get("hlb", 10.0) or 10.0)
    # Line 689: req_hlb = float(item.get("req_hlb", 10.0) or 10.0)
    
    val_none = None
    val_zero = 0.0
    val_twelve = 12.0

    res_none = float(val_none or 10.0)
    res_zero = float(val_zero or 10.0)
    res_twelve = float(val_twelve or 10.0)

    print(f"Input None -> Output: {res_none} (Expected fallback: 10.0)")
    print(f"Input 0.0  -> Output: {res_zero} (BUG! Expected 0.0, but '0.0 or 10.0' evaluates to 10.0!)")
    print(f"Input 12.0 -> Output: {res_twelve} (Expected: 12.0)")


def run_missing_smiles_moment_dilution_test():
    print("\n==================================================")
    print("EMPIRICAL TEST 3: MISSING SMILES MOMENT DILUTION")
    print("==================================================")
    # When an ingredient has no SMILES, compute_molecular_descriptors returns zeros(9)
    # Does this dilute descriptor means?
    recipe_full_smiles = [
        {"smiles": "NC(=O)c1cccnc1", "weight_percent": 10.0, "functional_role": "ACTIVE"}, # Niacinamide MW ~ 122.12
        {"smiles": "O", "weight_percent": 90.0, "functional_role": "SOLVENT"} # Water MW ~ 18.015
    ]
    recipe_missing_water_smiles = [
        {"smiles": "NC(=O)c1cccnc1", "weight_percent": 10.0, "functional_role": "ACTIVE"},
        {"smiles": "", "weight_percent": 90.0, "functional_role": "SOLVENT"} # Missing SMILES
    ]

    from rdkit import Chem
    from rdkit.Chem import Descriptors
    m_niac = Chem.MolFromSmiles("NC(=O)c1cccnc1")
    mw_niac = Descriptors.MolWt(m_niac)
    m_wat = Chem.MolFromSmiles("O")
    mw_wat = Descriptors.MolWt(m_wat)

    expected_mw_full = 0.10 * mw_niac + 0.90 * mw_wat
    expected_mw_missing = 0.10 * mw_niac + 0.90 * 0.0

    print(f"Niacinamide MW: {mw_niac:.2f}, Water MW: {mw_wat:.2f}")
    print(f"Weighted MW with complete SMILES: {expected_mw_full:.2f} g/mol")
    print(f"Weighted MW when Water SMILES is missing: {expected_mw_missing:.2f} g/mol")
    print(f"Observation: Missing SMILES imputes 0.0 for molecular descriptors, artificially deflating mixture MW by {expected_mw_full - expected_mw_missing:.2f} g/mol.")

if __name__ == "__main__":
    run_tkdn_empirical_stress_test()
    run_hlb_zero_truthiness_bug_test()
    run_missing_smiles_moment_dilution_test()
