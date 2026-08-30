// One-off content fix: rewrite the Rebar Cyclic-Plasticity Calibration
// overview to remove em-dashes and stiff AI-sounding phrasing.
// Run: npx sanity exec scripts/rewrite-rebar-overview.ts --with-user-token
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-08-15" });

function block(text: string, style: "h4" | "normal" = "normal") {
  return {
    _type: "block",
    style,
    children: [{ _type: "span", text }],
  };
}

async function main() {
  const doc = await client.fetch<{ _id: string } | null>(
    `*[_type=='project' && title=='Rebar Cyclic-Plasticity Calibration'][0]{_id}`
  );
  if (!doc) throw new Error("Project not found");

  const overview = [
    block("Problem", "h4"),
    block(
      "Reinforcing bar of unknown grade, the locally manufactured or scrap-sourced steel common in Ghanaian construction, needs a calibrated cyclic-plasticity model before it can be trusted in seismic or low-cycle-fatigue design. Curve-fitting a constitutive model to hysteresis data alone isn't enough. A fit that minimizes numerical error can still be physically meaningless, for example multiple backstresses collapsing to the same relaxation rate, and it can look correct in a fast surrogate while failing in a real finite-element solve where effects like strain localization only show up there."
    ),
    block("Process", "h4"),
    block(
      "Built a pipeline that fits three published cyclic-plasticity models (Chaboche, Updated Voce-Chaboche, and Ohno-Wang) behind one pluggable interface, then verifies every calibrated fit against a real ABAQUS solve: single-element for search-time checks, full 3D coupon for final verification, scored with the same objective function as the fast Python surrogate. A physics gate rejects or repairs parameter sets that fit the curve but violate physical consistency. Optimization uses a Sobol space-filling search to seed a refinement stage (Differential Evolution or Bayesian optimization via Optuna). Two of the three models need a compiled UMAT (user material subroutine). ABAQUS's standard route needs Intel Fortran, which wasn't available on this machine, so the UMATs were written in C++ and compiled with MSVC instead. The whole pipeline is grade-agnostic: yield stress and parameter bounds are per-run inputs rather than hard-coded to a steel spec, so it can be pointed at material of unknown provenance. Validated first against the open Kashani et al. (2019) B500C dataset as a pipeline-correctness check."
    ),
    block("Outcome", "h4"),
    block(
      "A working calibration and verification pipeline with a live GUI, validated against a published open dataset and ready to be pointed at real locally-sourced rebar. The project also produced a full literature review with per-claim confidence ratings behind the model and algorithm choices."
    ),
  ];

  await client.patch(doc._id).set({ overview }).commit();
  console.log("Rewrote overview:", doc._id);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
