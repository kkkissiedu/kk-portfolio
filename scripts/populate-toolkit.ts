// My Toolkit was rendering as a heading with nothing under it: all three
// item arrays on siteSettings were null, and ToolColumn returns null when a
// column is empty.
//
// Every entry below is drawn from work already on the two sites or from the
// CV's software section, not invented:
//   column 1  tools listed on the Anthracite architectural-structural projects
//             (revit, autocad, protastructure, tekla, lumion), ABAQUS, Fusion
//             and Grasshopper from the CV, and ETABS, SAP2000 and Midas from
//             the previous portfolio's own toolkit section
//   column 2  tools listed on the portfolio ML projects, plus the robotics and
//             edge deployment line of the CV
//   column 3  tools listed on the Anthracite 3d-design projects, matching the
//             CV's 3D design line
//
// Icons are not set here. The component maps these exact names to logo files
// in public/toolkit (see TOOL_LOGOS in app/components/Toolkit.tsx), so a name
// changed here must be changed there too. An icon uploaded per item in Studio
// still overrides both.
//
// Run: npx sanity exec scripts/populate-toolkit.ts --with-user-token
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-08-15" });

const COLUMN_1 = [
  "Autodesk Revit",
  "AutoCAD",
  "Tekla Structures",
  "ProtaStructure",
  "ETABS",
  "SAP2000",
  "Midas",
  "ABAQUS",
  "Autodesk Fusion",
  "Grasshopper (Rhino)",
  "Lumion",
];

const COLUMN_2 = [
  "Python",
  "PyTorch",
  "scikit-learn",
  "XGBoost",
  "OpenCV",
  "Ultralytics YOLO",
  "NVIDIA Jetson",
  "TensorRT",
  "ONNX Runtime",
  "NumPy",
  "Optuna",
  "Weights & Biases",
];

const COLUMN_3 = [
  "Blender",
  "ZBrush",
  "Substance Painter",
  "Marmoset Toolbag",
  "Unreal Engine",
  "Unity",
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe Premiere Pro",
];

const key = (n: number) =>
  Array.from({ length: n }, () =>
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
      Math.floor(Math.random() * 62)
    ]
  ).join("");

const items = (names: string[]) =>
  names.map((name) => ({ _type: "toolkitItem", _key: key(12), name }));

async function main() {
  const settings = await client.fetch<{ _id: string } | null>(
    `*[_type=='siteSettings'][0]{_id}`
  );
  if (!settings) throw new Error("siteSettings document not found");

  await client
    .patch(settings._id)
    .set({
      toolkitColumn1Items: items(COLUMN_1),
      toolkitColumn2Items: items(COLUMN_2),
      toolkitColumn3Items: items(COLUMN_3),
    })
    .commit();

  console.log(
    "patched",
    settings._id,
    `- ${COLUMN_1.length} / ${COLUMN_2.length} / ${COLUMN_3.length} items`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
