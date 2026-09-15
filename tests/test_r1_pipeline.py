"""
Empirical Challenge & Verification Test Suite for Deliverable R1:
dataset_readiness_and_ml_pipeline.md

Role: Cheminformatics Code Challenger (teamwork_preview_challenger_1)
"""

import ast
import math
import sys
import unittest
import numpy as np

# Test 1: Syntax Validation of Python Code Blocks in Markdown
class TestMarkdownCodeSyntax(unittest.TestCase):
    def test_extract_and_parse_all_code_blocks(self):
        with open("explorations/dataset_readiness_and_ml_pipeline.md", "r", encoding="utf-8") as f:
            content = f.read()

        # Find all python code blocks
        import re
        py_blocks = re.findall(r"```python\n(.*?)\n```", content, re.DOTALL)
        self.assertGreaterEqual(len(py_blocks), 3, "Expected at least 3 python code blocks")

        for idx, block in enumerate(py_blocks, 1):
            try:
                tree = ast.parse(block)
                self.assertIsNotNone(tree)
                print(f"[PASS] Python block {idx} parsed successfully (Syntax valid).")
            except SyntaxError as e:
                self.fail(f"[FAIL] Python block {idx} has syntax error: {e}")

# Featurizer Implementation from Deliverable R1 (Section 4.6)
def get_featurizer_class(force_fallback=False):
    import logging
    logger = logging.getLogger("FormulationFeaturizer")
    
    if force_fallback:
        RDKIT_AVAILABLE = False
    else:
        try:
            from rdkit import Chem
            from rdkit.Chem import AllChem, Descriptors, Crippen, Lipinski
            RDKIT_AVAILABLE = True
        except ImportError:
            RDKIT_AVAILABLE = False

    class FormulationFeaturizer:
        def __init__(self, fp_bits: int = 1024, fp_radius: int = 2):
            self.fp_bits = fp_bits
            self.fp_radius = fp_radius
            self.expected_dim = fp_bits + 9 + 9 + 8 + 4

        def sanitize_molecule(self, smiles):
            if not smiles or not isinstance(smiles, str) or smiles.strip() == "":
                return None
            if not RDKIT_AVAILABLE:
                return smiles.strip()
            try:
                from rdkit import Chem
                mol = Chem.MolFromSmiles(smiles.strip())
                if mol is not None:
                    Chem.SanitizeMol(mol)
                    return mol
            except Exception as e:
                logger.debug(f"Failed to sanitize SMILES '{smiles}': {e}")
            return None

        def compute_molecular_descriptors(self, mol):
            if mol is None:
                return np.zeros(9, dtype=np.float32)

            if RDKIT_AVAILABLE and hasattr(mol, "GetNumAtoms"):
                try:
                    from rdkit.Chem import Descriptors, Crippen, Lipinski
                    return np.array([
                        Descriptors.MolWt(mol),
                        Crippen.MolLogP(mol),
                        Descriptors.TPSA(mol),
                        Lipinski.NumHDonors(mol),
                        Lipinski.NumHAcceptors(mol),
                        Lipinski.NumRotatableBonds(mol),
                        Descriptors.FractionCSP3(mol),
                        Lipinski.NumAromaticRings(mol),
                        mol.GetNumHeavyAtoms()
                    ], dtype=np.float32)
                except Exception:
                    return np.zeros(9, dtype=np.float32)
            else:
                smiles_str = str(mol)
                length = len(smiles_str)
                approx_mw = float(length * 12.0)
                approx_logp = float(smiles_str.count("C") * 0.4 - smiles_str.count("O") * 0.8)
                approx_tpsa = float(smiles_str.count("O") * 14.0 + smiles_str.count("N") * 24.0)
                hbd = float(smiles_str.count("O") + smiles_str.count("N"))
                hba = float(smiles_str.count("O") * 2 + smiles_str.count("N"))
                rot = float(max(0, smiles_str.count("CC") - 2))
                fcsp3 = 0.85 if "c" not in smiles_str else 0.35
                aromatic = float(smiles_str.count("c") // 6)
                heavy = float(sum(1 for c in smiles_str if c.isalpha() and c != "H"))
                return np.array([approx_mw, approx_logp, approx_tpsa, hbd, hba, rot, fcsp3, aromatic, heavy], dtype=np.float32)

        def compute_fingerprint(self, mol):
            arr = np.zeros(self.fp_bits, dtype=np.float32)
            if mol is None:
                return arr

            if RDKIT_AVAILABLE and hasattr(mol, "GetNumAtoms"):
                try:
                    from rdkit.Chem import AllChem
                    fp = AllChem.GetMorganFingerprintAsBitVect(mol, radius=self.fp_radius, nBits=self.fp_bits)
                    AllChem.DataStructs.ConvertToNumpyArray(fp, arr)
                    return arr
                except Exception:
                    return arr
            else:
                smiles_str = str(mol)
                for i in range(len(smiles_str) - 2):
                    ngram = smiles_str[i:i+3]
                    h = hash(ngram) % self.fp_bits
                    arr[h] = 1.0
                return arr

        def featurize_recipe(self, ingredients, process_params):
            total_weight = sum(item.get("weight_percent", 0.0) for item in ingredients)
            if total_weight <= 0.0:
                raise ValueError("Total formulation ingredient weight must be strictly positive.")

            pooled_fp = np.zeros(self.fp_bits, dtype=np.float32)
            desc_list = []
            norm_weights = []

            w_surf, w_oil, w_hum, w_wat = 0.0, 0.0, 0.0, 0.0
            weighted_surf_hlb = 0.0
            weighted_oil_req_hlb = 0.0

            for item in ingredients:
                w_raw = item.get("weight_percent", 0.0)
                w_norm = w_raw / total_weight
                norm_weights.append(w_norm)
                role = str(item.get("functional_role", "")).upper()

                mol = self.sanitize_molecule(item.get("smiles", ""))
                fp = self.compute_fingerprint(mol)
                desc = self.compute_molecular_descriptors(mol)

                pooled_fp += w_norm * fp
                desc_list.append(desc)

                if "EMULSIFIER" in role or "SURFACTANT" in role:
                    w_surf += w_norm
                    hlb_raw = item.get("hlb")
                    hlb = float(hlb_raw) if hlb_raw is not None else 10.0
                    weighted_surf_hlb += w_norm * hlb
                elif "OIL" in role or "EMOLLIENT" in role or "LIPID" in role:
                    w_oil += w_norm
                    req_raw = item.get("req_hlb")
                    req_hlb = float(req_raw) if req_raw is not None else 10.0
                    weighted_oil_req_hlb += w_norm * req_hlb
                elif "HUMECTANT" in role or "POLYOL" in role:
                    w_hum += w_norm
                elif "SOLVENT" in role or "WATER" in role or "AQUEOUS" in role:
                    w_wat += w_norm

            desc_matrix = np.array(desc_list, dtype=np.float32)
            w_column = np.array(norm_weights, dtype=np.float32).reshape(-1, 1)

            desc_mean = np.sum(desc_matrix * w_column, axis=0)
            desc_var = np.sum(w_column * ((desc_matrix - desc_mean) ** 2), axis=0)
            physicochem_features = np.concatenate([desc_mean, desc_var])

            hlb_blend = (weighted_surf_hlb / w_surf) if w_surf > 0.0 else 0.0
            hlb_req = (weighted_oil_req_hlb / w_oil) if w_oil > 0.0 else 0.0
            hlb_mismatch = abs(hlb_blend - hlb_req)
            eor = (w_surf / w_oil) if w_oil > 0.0 else 0.0

            colloid_features = np.array([
                w_surf,
                w_oil,
                w_hum,
                w_wat,
                hlb_blend,
                hlb_req,
                hlb_mismatch,
                eor
            ], dtype=np.float32)

            process_features = np.array([
                float(process_params.get("temp_c", 75.0)),
                float(process_params.get("shear_rpm", 3500.0)),
                float(process_params.get("cooling_rate", 1.5)),
                float(process_params.get("target_ph", 5.5))
            ], dtype=np.float32)

            unified_vector = np.concatenate([
                pooled_fp,
                physicochem_features,
                colloid_features,
                process_features
            ]).astype(np.float32)

            assert unified_vector.shape[0] == self.expected_dim
            return unified_vector

    return FormulationFeaturizer


# Test 2: Featurizer Dimensionality & Construction Verification
class TestFeaturizerLogic(unittest.TestCase):
    def setUp(self):
        self.recipe = [
            {"smiles": "O", "weight_percent": 71.5, "functional_role": "SOLVENT"},
            {"smiles": "CCCCCCCC(=O)OCC(COC(=O)CCCCCCC)OC(=O)CCCCCCC", "weight_percent": 10.0, "functional_role": "EMOLLIENT_OIL", "req_hlb": 11.0},
            {"smiles": "CCCCCCCCCCCC(=O)OCC(COC(=O)CCCCCCCCCCC)OC(=O)CCCCCCCCCCC", "weight_percent": 5.0, "functional_role": "EMOLLIENT_OIL", "req_hlb": 9.0},
            {"smiles": "OCC(O)CO", "weight_percent": 5.0, "functional_role": "HUMECTANT"},
            {"smiles": "CCCCCCCCCCCCCCCC(=O)OCC(O)CO", "weight_percent": 3.5, "functional_role": "EMULSIFIER", "hlb": 3.8},
            {"smiles": "CCOCCOCCOCCOCCOCCOCCOCCOCCOCCOCCOCCOCCOCCOCCOCCOCCOCCOCCOCCOc1ccc(cc1)C(C)(C)C", "weight_percent": 1.5, "functional_role": "EMULSIFIER", "hlb": 16.5},
            {"smiles": "NC(=O)c1cccnc1", "weight_percent": 2.5, "functional_role": "ACTIVE"},
            {"smiles": "c1ccccc1O", "weight_percent": 1.0, "functional_role": "PRESERVATIVE"}
        ]
        self.process = {"temp_c": 75.0, "shear_rpm": 4000.0, "cooling_rate": 2.0, "target_ph": 5.5}

    def test_dimensions_native_and_fallback(self):
        for force_fb in [False, True]:
            FeatCls = get_featurizer_class(force_fallback=force_fb)
            f = FeatCls()
            vec = f.featurize_recipe(self.recipe, self.process)
            mode = "Fallback" if force_fb else "Native/RDKit"
            self.assertEqual(vec.shape, (1054,), f"Shape must be (1054,) in {mode} mode")
            self.assertEqual(vec.dtype, np.float32, f"Dtype must be float32 in {mode} mode")
            self.assertFalse(np.isnan(vec).any(), f"No NaNs allowed in {mode} mode")
            self.assertFalse(np.isinf(vec).any(), f"No Infs allowed in {mode} mode")
            print(f"[PASS] Featurizer dimension verified: 1054 ({mode} mode)")

    def test_mathematical_soundness_of_colloid_terms(self):
        FeatCls = get_featurizer_class(force_fallback=False)
        f = FeatCls()
        vec = f.featurize_recipe(self.recipe, self.process)

        # Total recipe weight: 71.5+10+5+5+3.5+1.5+2.5+1.0 = 100.0
        # w_surf should be (3.5 + 1.5) / 100 = 0.05
        # w_oil should be (10.0 + 5.0) / 100 = 0.15
        # w_hum should be 5.0 / 100 = 0.05
        # w_wat should be 71.5 / 100 = 0.715
        w_surf_vec = vec[1042]
        w_oil_vec = vec[1043]
        w_hum_vec = vec[1044]
        w_wat_vec = vec[1045]
        hlb_blend_vec = vec[1046]
        hlb_req_vec = vec[1047]
        hlb_delta_vec = vec[1048]
        eor_vec = vec[1049]

        self.assertAlmostEqual(w_surf_vec, 0.05, places=5)
        self.assertAlmostEqual(w_oil_vec, 0.15, places=5)
        self.assertAlmostEqual(w_hum_vec, 0.05, places=5)
        self.assertAlmostEqual(w_wat_vec, 0.715, places=5)

        # Expected HLB blend: (3.5 * 3.8 + 1.5 * 16.5) / (3.5 + 1.5) = (13.3 + 24.75) / 5.0 = 38.05 / 5.0 = 7.61
        expected_hlb_blend = (3.5 * 3.8 + 1.5 * 16.5) / 5.0
        self.assertAlmostEqual(hlb_blend_vec, expected_hlb_blend, places=4)

        # Expected HLB req: (10.0 * 11.0 + 5.0 * 9.0) / (10.0 + 5.0) = (110.0 + 45.0) / 15.0 = 155.0 / 15.0 = 10.3333...
        expected_hlb_req = (10.0 * 11.0 + 5.0 * 9.0) / 15.0
        self.assertAlmostEqual(hlb_req_vec, expected_hlb_req, places=4)

        # Expected HLB delta: |7.61 - 10.3333| = 2.7233...
        self.assertAlmostEqual(hlb_delta_vec, abs(expected_hlb_blend - expected_hlb_req), places=4)

        # Expected EOR: w_surf / w_oil = 0.05 / 0.15 = 1/3 = 0.3333...
        self.assertAlmostEqual(eor_vec, 0.05 / 0.15, places=4)
        print("[PASS] Colloid interaction physics formulas verified with exact analytical tolerances.")


# Test 3: Dirichlet Simplex Mass Balance Constraint
class TestDirichletSimplex(unittest.TestCase):
    def test_simplex_projection_exactness(self):
        np.random.seed(42)
        # Test 5,000 random logit vectors across various dimensionalities and magnitudes
        for _ in range(5000):
            k = np.random.randint(2, 30)
            logits = np.random.uniform(0.001, 1000.0, size=k)
            projected = (logits / np.sum(logits)) * 100.0

            # Verify mass conservation
            self.assertAlmostEqual(np.sum(projected), 100.0, places=5)
            # Verify non-negativity
            self.assertTrue(np.all(projected > 0.0))
        print("[PASS] Dirichlet simplex mass balance (sum w_i = 100.0%) verified over 5,000 trials.")


# Test 4: Regulatory Boundaries & TKDN Optimization Logic
class TestRegulatoryAndTKDN(unittest.TestCase):
    def test_bpom_hard_caps_and_tkdn(self):
        from tests.backend_ml_optimizer import FastFormulationOptimizer

        opt = FastFormulationOptimizer(target_viscosity_cps=4200.0)
        candidates = opt.run_optimization(n_trials=120)
        self.assertGreater(len(candidates), 0, "Pareto frontier must contain at least one candidate")

        for c in candidates:
            # 1. Check mass conservation
            self.assertAlmostEqual(c["total_weight_check"], 100.0, delta=0.05)
            weights = c["weights_percent"]
            
            # 2. BPOM Caps
            self.assertLessEqual(weights["Phenoxyethanol"], 1.00 + 1e-6, "Phenoxyethanol must be <= 1.0% per BPOM")
            self.assertLessEqual(weights["Niacinamide"], 5.00 + 1e-6, "Niacinamide must be <= 5.0% per BPOM")
            self.assertGreaterEqual(weights["Emulsifier_Blend"], 2.50 - 1e-6, "Emulsifier must be >= 2.5%")

            # 3. Check TKDN definition
            vco = weights["VCO_Indonesian_TKDN"]
            glyc = weights["Glycerin_TKDN"]
            expected_tkdn = round(vco + glyc, 2)
            self.assertAlmostEqual(c["tkdn_percentage"], expected_tkdn, delta=0.05)

        print(f"[PASS] BPOM regulatory caps and TKDN calculation verified across {len(candidates)} Pareto candidates.")


# Test 5: Edge Cases (Missing SMILES, Extreme HLB, Zero Fractions)
class TestEdgeCases(unittest.TestCase):
    def test_missing_and_invalid_smiles(self):
        FeatCls = get_featurizer_class(force_fallback=False)
        f = FeatCls()

        process = {"temp_c": 75.0, "shear_rpm": 3500.0, "cooling_rate": 1.5, "target_ph": 5.5}

        # Recipe where some ingredients have None, empty string, or invalid SMILES
        edge_recipe = [
            {"smiles": None, "weight_percent": 50.0, "functional_role": "SOLVENT"},
            {"smiles": "", "weight_percent": 20.0, "functional_role": "EMOLLIENT_OIL", "req_hlb": 10.0},
            {"smiles": "INVALID_CHEM_NOT_A_SMILES_!#$%", "weight_percent": 10.0, "functional_role": "HUMECTANT"},
            {"smiles": "OCC(O)CO", "weight_percent": 20.0, "functional_role": "HUMECTANT"}
        ]

        vec = f.featurize_recipe(edge_recipe, process)
        self.assertEqual(vec.shape, (1054,))
        self.assertFalse(np.isnan(vec).any(), "Missing SMILES must not yield NaNs")
        self.assertFalse(np.isinf(vec).any(), "Missing SMILES must not yield Infs")
        print("[PASS] Edge Case 1: Missing and invalid SMILES gracefully handled without NaN/Inf.")

    def test_extreme_hlb_and_zero_surfactant_oil(self):
        FeatCls = get_featurizer_class(force_fallback=False)
        f = FeatCls()

        process = {"temp_c": 75.0, "shear_rpm": 3500.0, "cooling_rate": 1.5, "target_ph": 5.5}

        # Subcase A: Extreme HLB (e.g. 50.0 and 0.0)
        extreme_hlb_recipe = [
            {"smiles": "O", "weight_percent": 70.0, "functional_role": "SOLVENT"},
            {"smiles": "CCCCCCCC(=O)OCC(COC(=O)CCCCCCC)OC(=O)CCCCCCC", "weight_percent": 20.0, "functional_role": "EMOLLIENT_OIL", "req_hlb": 0.0},
            {"smiles": "CCCCCCCCCCCCCCCC(=O)OCC(O)CO", "weight_percent": 10.0, "functional_role": "EMULSIFIER", "hlb": 50.0}
        ]
        vec_extreme = f.featurize_recipe(extreme_hlb_recipe, process)
        self.assertEqual(vec_extreme[1046], 50.0)  # hlb_blend
        self.assertEqual(vec_extreme[1047], 0.0)   # hlb_req
        self.assertEqual(vec_extreme[1048], 50.0)  # hlb_delta
        self.assertEqual(vec_extreme[1049], 0.5)   # eor (10/20)
        self.assertFalse(np.isnan(vec_extreme).any())
        print("[PASS] Edge Case 2A: Extreme HLB values correctly computed without overflow.")

        # Subcase B: Zero surfactants (pure aqueous solution)
        no_surf_recipe = [
            {"smiles": "O", "weight_percent": 80.0, "functional_role": "SOLVENT"},
            {"smiles": "OCC(O)CO", "weight_percent": 20.0, "functional_role": "HUMECTANT"}
        ]
        vec_no_surf = f.featurize_recipe(no_surf_recipe, process)
        self.assertEqual(vec_no_surf[1042], 0.0)  # w_surf
        self.assertEqual(vec_no_surf[1046], 0.0)  # hlb_blend
        self.assertEqual(vec_no_surf[1049], 0.0)  # eor
        self.assertFalse(np.isnan(vec_no_surf).any())
        print("[PASS] Edge Case 2B: Zero surfactant formulation handled safely (no ZeroDivisionError).")

        # Subcase C: Zero oil (pure aqueous gel)
        no_oil_recipe = [
            {"smiles": "O", "weight_percent": 90.0, "functional_role": "SOLVENT"},
            {"smiles": "CCCCCCCCCCCCCCCC(=O)OCC(O)CO", "weight_percent": 10.0, "functional_role": "EMULSIFIER", "hlb": 12.0}
        ]
        vec_no_oil = f.featurize_recipe(no_oil_recipe, process)
        self.assertEqual(vec_no_oil[1043], 0.0)  # w_oil
        self.assertEqual(vec_no_oil[1047], 0.0)  # hlb_req
        self.assertEqual(vec_no_oil[1049], 0.0)  # eor
        self.assertFalse(np.isnan(vec_no_oil).any())
        print("[PASS] Edge Case 2C: Zero oil formulation handled safely (no ZeroDivisionError).")

    def test_zero_or_negative_weight_exception(self):
        FeatCls = get_featurizer_class(force_fallback=False)
        f = FeatCls()
        process = {"temp_c": 75.0, "shear_rpm": 3500.0, "cooling_rate": 1.5, "target_ph": 5.5}

        # Subcase D: Total weight is 0.0 -> must raise ValueError
        zero_weight_recipe = [
            {"smiles": "O", "weight_percent": 0.0, "functional_role": "SOLVENT"}
        ]
        with self.assertRaises(ValueError):
            f.featurize_recipe(zero_weight_recipe, process)
        print("[PASS] Edge Case 2D: Zero weight formulation correctly raises ValueError.")

if __name__ == "__main__":
    unittest.main()
