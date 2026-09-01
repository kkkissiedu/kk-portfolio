// One-off content addition: GhanaCrack autonomous inspection robot.
// Work in progress — deliberately NO performance metrics are published
// (no FPS, mAP, Dice or width-accuracy claims) until results are final.
// Images are prepared crops of the model-comparison figures, with the
// per-frame latency badges removed for the same reason.
// Run: npx sanity exec scripts/add-ghanacrack-robot.ts --with-user-token
import { getCliClient } from "sanity/cli";
import fs from "node:fs";
import path from "node:path";

const client = getCliClient({ apiVersion: "2025-08-15" });

// Forward slashes on purpose: a backslashed Windows path in a scanned source
// file is read by Tailwind v4 as a CSS unicode escape and breaks the build.
const ASSET_DIR =
  "C:/Users/kissi/AppData/Local/Temp/claude/D--WORK-FOLDER-THE-ANTHRACITE-WEBSITE/" +
  "231cbe60-9bab-4646-b111-b85a93edb803/scratchpad/robot_assets";

const HERO = "ghanacrack-segmentation-hero.jpg";
const GALLERY = [
  "ghanacrack-segmentation-hero.jpg",
  "ghanacrack-comparison-04.jpg",
  "ghanacrack-comparison-03.jpg",
  "ghanacrack-comparison-06.jpg",
  "ghanacrack-comparison-01.jpg",
];

function block(text: string, style: "h4" | "normal" = "normal") {
  return {
    _type: "block",
    style,
    children: [{ _type: "span", text }],
  };
}

async function upload(filename: string) {
  const abs = path.join(ASSET_DIR, filename);
  const buffer = fs.readFileSync(abs);
  return client.assets.upload("image", buffer, { filename });
}

async function main() {
  console.log("Uploading images...");
  const assets: Record<string, string> = {};
  for (const f of GALLERY) {
    process.stdout.write(`- ${f} ... `);
    const a = await upload(f);
    assets[f] = a._id;
    console.log(a._id);
  }

  const overview = [
    block("Problem", "h4"),
    block(
      "Ageing reinforced concrete across West Africa is inspected largely by eye. Manual survey is slow, subjective, hard to repeat consistently, and difficult to scale across the number of bridges and buildings that need monitoring. The commercial systems that automate this are priced for markets that can absorb them, which leaves a gap where the need is arguably greatest."
    ),
    block("Approach", "h4"),
    block(
      "A self-built, self-funded autonomous ground robot that drives a structure and characterises what it finds without sending anything to the cloud. The full computer vision pipeline runs on-board on an NVIDIA Jetson, so the robot works in the field with no connectivity. Segmentation output is passed through morphological post-processing (skeletonisation, branch-point detection, connected-component analysis) to recover per-instance crack geometry and build a crack graph, with an on-board IMU correcting for surface inclination when converting pixel measurements to real-world units. A survey mode logs geotagged detections and renders them as an interactive defect map with an inspection report."
    ),
    block("Current work", "h4"),
    block(
      "The prototype runs. Present effort is a systematic benchmark of segmentation and detection architectures on concrete crack imagery, profiled across inference backends to find what is genuinely deployable on constrained edge hardware rather than what performs best on a workstation. Alongside this, GhanaCrack, an annotated West African concrete defect dataset, is being assembled so that evaluation reflects tropical field conditions rather than the European and North American imagery that dominates existing datasets. Hardware is moving from a Jetson Nano to a Jetson Orin NX. Results are not published yet."
    ),
  ];

  const doc = {
    _type: "project",
    title: "GhanaCrack — Autonomous Concrete Inspection Robot",
    slug: { _type: "slug", current: "ghanacrack-inspection-robot" },
    category: "ml-research",
    subcategory: "Robotics · Edge AI",
    shortDescription:
      "A self-built autonomous ground robot that surveys concrete infrastructure and characterises defects on-board, running its entire vision pipeline at the edge.",
    overview,
    mainImage: {
      _type: "image",
      asset: { _type: "reference", _ref: assets[HERO] },
    },
    gallery: GALLERY.map((f) => ({
      _type: "image",
      _key: assets[f],
      asset: { _type: "reference", _ref: assets[f] },
    })),
    githubUrl: "https://github.com/kkkissiedu/Construction-Site-Monitoring-Robot",
    tools: [
      "Python",
      "PyTorch",
      "YOLO11",
      "NVIDIA Jetson",
      "TensorRT",
      "ONNX Runtime",
      "OpenCV",
      "Edge Deployment",
      "Robotics",
      "GPS & IMU Sensor Fusion",
    ],
    // 0 puts it first without renumbering the existing projects (1-10, 20)
    order: 0,
    featured: true,
  };

  const created = await client.create(doc);
  console.log("Created:", created._id);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
