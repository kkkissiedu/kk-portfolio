// One-off content addition: Rebar Cyclic-Plasticity Calibration project.
// Images are fetched from the public GitHub repo (raw.githubusercontent.com)
// and uploaded as Sanity image assets.
// Run: npx sanity exec scripts/add-rebar-calibration-project.ts --with-user-token
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-08-15" });

const IMAGES = [
  "https://raw.githubusercontent.com/kkkissiedu/Rebar-Cyclic-Plasticity-Calibration/main/figures/app-screenshot.png",
  "https://raw.githubusercontent.com/kkkissiedu/Rebar-Cyclic-Plasticity-Calibration/main/figures/fe-verification-2pct-16mm.png",
  "https://raw.githubusercontent.com/kkkissiedu/Rebar-Cyclic-Plasticity-Calibration/main/figures/abaqus-deformed-mesh-mises.png",
];

function block(text: string, style: "h4" | "normal" = "normal") {
  return {
    _type: "block",
    style,
    children: [{ _type: "span", text }],
  };
}

async function uploadFromUrl(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  return client.assets.upload("image", buffer, {
    filename: url.split("/").pop(),
  });
}

async function main() {
  console.log("Uploading images...");
  const assets = [];
  for (const url of IMAGES) {
    process.stdout.write(`- ${url.split("/").pop()} ... `);
    const asset = await uploadFromUrl(url);
    assets.push(asset);
    console.log(`done (${asset._id})`);
  }

  const overview = [
    block("Problem", "h4"),
    block(
      "Reinforcing bar of unknown grade — locally manufactured or scrap-sourced steel common in Ghanaian construction — needs a calibrated cyclic-plasticity model before it can be trusted in seismic or low-cycle-fatigue design. Curve-fitting a constitutive model to hysteresis data alone is not enough: a fit that minimizes numerical error can still be physically meaningless (e.g. multiple backstresses collapsing to the same relaxation rate), and can look correct in a fast surrogate while failing in a real finite-element solve where effects like strain localization actually show up."
    ),
    block("Process", "h4"),
    block(
      "Built a pipeline that fits three published cyclic-plasticity models — Chaboche, Updated Voce-Chaboche, and Ohno-Wang — behind one pluggable interface, then verifies every calibrated fit against a real ABAQUS solve (single-element for search-time checks, full 3D coupon for final verification), scored with the same objective function as the fast Python surrogate. A physics gate rejects or repairs parameter sets that fit the curve but violate physical consistency. Optimization uses a Sobol space-filling search to seed a refinement stage (Differential Evolution or Bayesian optimization via Optuna). Two of the three models require a compiled UMAT (user material subroutine) — ABAQUS's standard route needs Intel Fortran, unavailable on this machine, so the UMATs were written in C++ and compiled with MSVC instead. The whole pipeline is grade-agnostic: yield stress and parameter bounds are per-run inputs rather than hard-coded to a steel spec, so it can be pointed at material of unknown provenance. Validated first against the open Kashani et al. (2019) B500C dataset as a pipeline-correctness check."
    ),
    block("Outcome", "h4"),
    block(
      "A working calibration-and-verification pipeline with a live GUI, validated against a published open dataset, ready to be pointed at real locally-sourced rebar. The project also produced a full literature review with per-claim confidence ratings behind the model and algorithm choices."
    ),
  ];

  const doc = {
    _type: "project",
    title: "Rebar Cyclic-Plasticity Calibration",
    slug: { _type: "slug", current: "rebar-cyclic-plasticity-calibration" },
    category: "ml-research",
    shortDescription:
      "Calibration and ABAQUS finite-element verification pipeline for cyclic-plasticity constitutive models, validated on reinforcing-bar low-cycle-fatigue data.",
    overview,
    mainImage: {
      _type: "image",
      asset: { _type: "reference", _ref: assets[0]._id },
    },
    gallery: assets.map((a) => ({
      _type: "image",
      _key: a._id,
      asset: { _type: "reference", _ref: a._id },
    })),
    githubUrl: "https://github.com/kkkissiedu/Rebar-Cyclic-Plasticity-Calibration",
    tools: [
      "Python",
      "ABAQUS/CAE",
      "C++ (UMAT)",
      "NumPy",
      "SciPy",
      "Optuna",
      "Numba",
      "Tkinter",
    ],
    order: 10,
    featured: false,
  };

  const created = await client.create(doc);
  console.log(`Created project: ${created._id}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
