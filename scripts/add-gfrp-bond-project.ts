// GFRP bond stress-slip study, added to the ML & Research work.
//
// Copy was reviewed by the user before publication. Two constraints they set:
// papers are in preparation, so the prose states findings without the headline
// numbers; and the gallery shows specimens only, no wide shots of the lab with
// identifiable people in them.
//
// The model comparison chart is REBUILT from ml/results/taskB2_results.csv, not
// taken from ch4_figures/fig4_7_taskB_rmse.png. That file predates the July 2026
// bond-stress correction and shows GPR winning with ridge near the bottom, the
// reverse of the current result.
//
// Run: npx sanity exec scripts/add-gfrp-bond-project.ts --with-user-token
import { getCliClient } from "sanity/cli";
import fs from "node:fs";
import path from "node:path";

const client = getCliClient({ apiVersion: "2025-08-15" });

// Forward slashes on purpose: a backslashed Windows path in a scanned source
// file is read by Tailwind v4 as a CSS unicode escape and breaks the build.
const ASSET_DIR =
  "C:/Users/kissi/AppData/Local/Temp/claude/D--WORK-FOLDER-THE-ANTHRACITE-WEBSITE/" +
  "231cbe60-9bab-4646-b111-b85a93edb803/scratchpad/gfrp_assets";

const SLUG = "gfrp-bond-stress-slip";

// First entry also becomes the card image. Ordered experiment first, then the
// finite element model, then the modelling result.
const IMAGES = [
  "gfrp-crack-at-bar.jpg",
  "gfrp-bar-at-fracture-face.jpg",
  "gfrp-failure-wedge.jpg",
  "gfrp-abaqus-model.png",
  "gfrp-model-comparison.png",
];

const SECTIONS: [string, string][] = [
  [
    "Problem",
    "GFRP bars do not corrode, which makes them attractive for tropical and " +
      "coastal exposure where steel reinforcement has a short service life. They " +
      "also bond to concrete by a different mechanism than steel, and the bond " +
      "provisions in design codes were calibrated in the steel era. Bond is what " +
      "sets development length, so how far those provisions carry across is not " +
      "a detail.",
  ],
  [
    "Experimental programme",
    "Double-prism beam pull-out specimens were cast with GFRP and steel bars " +
      "across a range of bar diameters and concrete grades, then loaded to " +
      "failure with slip measured at the unloaded end. Almost every specimen " +
      "failed by diagonal shear-flexural cracking of the surrounding concrete " +
      "rather than by the bar pulling out. That is itself a result, because it " +
      "means the measured peaks describe the prism as much as the interface.",
  ],
  [
    "Modelling",
    "Classical bond-slip laws were fitted per specimen, the BPE, CMR and fib " +
      "Model Code formulations, to characterise curve shape. Prediction was then " +
      "posed at both the reading and specimen level across a wide model set: " +
      "ridge and polynomial regression, random forest, XGBoost, support vector " +
      "regression, Gaussian process regression, a multilayer perceptron with " +
      "piecewise-linear embeddings, and TabPFN, benchmarked throughout against " +
      "the ACI 440.1R design equation. Finite element models of the double-prism " +
      "specimen were built in ABAQUS alongside the physical testing.",
  ],
  [
    "The evaluation problem",
    "Bond stress is an exact algebraic function of applied load and bar " +
      "diameter. Supplying load as an input lets a model invert its own defining " +
      "equation and report an accuracy that means nothing. Removing it, and " +
      "grouping the cross-validation so no specimen appears in both training and " +
      "test, reverses the conclusions of the study. Establishing that protocol " +
      "was the largest single correction the work made.",
  ],
  [
    "What held up",
    "Under honest evaluation a plain linear model was the best specimen-level " +
      "predictor, and nothing more expressive improved on it. Transfer learning " +
      "from a compiled literature database produced negative transfer in both " +
      "attempts. The design equation is close to unbiased on average but ranks " +
      "specimens in roughly the wrong order. The binding constraint is the " +
      "number of physical specimens, not the choice of model.",
  ],
  [
    "Scaling the data",
    "A database of pull-out records was compiled from the published literature " +
      "to test whether the ceiling was the method or the sample. Split at random " +
      "it looks highly predictable. Split so that no source study appears on " +
      "both sides, most of that accuracy disappears. A model trained on the " +
      "literature alone and tested against this study's GFRP specimens still " +
      "beat the code equation by a wide margin.",
  ],
  ["Status", "Ongoing, with papers in preparation."],
];

const TOOLS = [
  "Python",
  "scikit-learn",
  "XGBoost",
  "PyTorch",
  "TabPFN",
  "Optuna",
  "ABAQUS",
];

const key = (n: number) =>
  Array.from({ length: n }, () =>
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
      Math.floor(Math.random() * 62)
    ]
  ).join("");

const block = (style: string, text: string) => ({
  _type: "block",
  _key: key(12),
  style,
  markDefs: [],
  children: [{ _type: "span", _key: key(12), marks: [], text }],
});

async function main() {
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type=='project' && slug.current==$slug][0]{_id}`,
    { slug: SLUG }
  );

  const uploaded = [];
  for (const f of IMAGES) {
    const a = await client.assets.upload("image", fs.readFileSync(path.join(ASSET_DIR, f)), {
      filename: f,
    });
    console.log("uploaded", f, "->", a._id);
    uploaded.push(a._id);
  }

  const doc = {
    _type: "project",
    title: "Bond Stress-Slip Behaviour of GFRP-Reinforced Concrete",
    slug: { _type: "slug", current: SLUG },
    category: "ml-research",
    subcategory: "Experimental Testing · Machine Learning",
    shortDescription:
      "Pull-out testing of GFRP and steel reinforcement in concrete, with a " +
      "modelling study of how far bond strength can honestly be predicted from " +
      "geometry and concrete grade. Conducted with Ing. Norbert Kyei at KNUST.",
    overview: SECTIONS.flatMap(([h, body]) => [block("h4", h), block("normal", body)]),
    tools: TOOLS,
    order: 2,
    featured: false,
    mainImage: { _type: "image", asset: { _type: "reference", _ref: uploaded[0] } },
    gallery: uploaded.map((id) => ({
      _type: "image",
      _key: id,
      asset: { _type: "reference", _ref: id },
    })),
  };

  if (existing) {
    await client.patch(existing._id).set(doc).commit();
    console.log("updated", existing._id);
  } else {
    const created = await client.create(doc);
    console.log("created", created._id);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
