// GhanaCrack gallery: single-image crack overlays.
//
// Replaces the earlier 4-panel comparison strips (and the tiled video poster
// frame that led the gallery) with one image per file. Sources are the held-out
// test splits: YOLO11l-seg on the benchmark split, and the from-scratch
// EfficientNet-U-Net on its own. Masks are rendered in the site accent cyan by
// scratchpad/render_single_overlays.py.
//
// Also appends the architectures-evaluated paragraph to the overview.
//
// Run: npx sanity exec scripts/replace-ghanacrack-images.ts --with-user-token
import { getCliClient } from "sanity/cli";
import fs from "node:fs";
import path from "node:path";

const client = getCliClient({ apiVersion: "2025-08-15" });

// Forward slashes on purpose: a backslashed Windows path in a scanned source
// file is read by Tailwind v4 as a CSS unicode escape and breaks the build.
const ASSET_DIR =
  "C:/Users/kissi/AppData/Local/Temp/claude/D--WORK-FOLDER-THE-ANTHRACITE-WEBSITE/" +
  "231cbe60-9bab-4646-b111-b85a93edb803/scratchpad/robot_assets/final";

// Order matters: the first entry also becomes the card image.
const IMAGES = [
  "ghanacrack-yolo11l-01.jpg",
  "ghanacrack-efficientnet-01.jpg",
  "ghanacrack-yolo11l-02.jpg",
  "ghanacrack-efficientnet-02.jpg",
  "ghanacrack-yolo11l-03.jpg",
  "ghanacrack-efficientnet-03.jpg",
];

const ARCHITECTURES =
  "The comparison is not limited to off-the-shelf detectors. Five segmentation " +
  "networks were written from scratch in PyTorch and trained on the same crack " +
  "dataset: EfficientNet-U-Net, MobileNetV4-U-Net, DeepLabV3+, Attention U-Net " +
  "and a classic U-Net baseline. These sit alongside fine-tuned YOLO11-seg " +
  "(n, s, m, l), YOLO26-seg (n, s) and FastSAM. Each one is profiled the same " +
  "way, at FP16 and through ONNX and TensorRT export, so what ships on the " +
  "robot is chosen on measured edge behaviour rather than headline accuracy. " +
  "The images here are segmentation output from that study.";

const key = (n: number) =>
  Array.from({ length: n }, () =>
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
      Math.floor(Math.random() * 62)
    ]
  ).join("");

async function main() {
  const doc = await client.fetch<{ _id: string; overview?: unknown[] } | null>(
    `*[_type=='project' && slug.current=='ghanacrack-inspection-robot'][0]{_id, overview}`
  );
  if (!doc) throw new Error("GhanaCrack project not found");

  const uploaded = [];
  for (const f of IMAGES) {
    const a = await client.assets.upload("image", fs.readFileSync(path.join(ASSET_DIR, f)), {
      filename: f,
    });
    console.log("uploaded", f, "->", a._id);
    uploaded.push(a._id);
  }

  const gallery = uploaded.map((id) => ({
    _type: "image",
    _key: id,
    asset: { _type: "reference", _ref: id },
  }));

  // Skip if the paragraph is already there, so the script stays re-runnable.
  type Block = { children?: { text?: string }[] };
  const overview = (doc.overview as Block[]) ?? [];
  const already = overview.some((b) =>
    (b.children ?? []).some((c) => (c.text ?? "").includes("written from scratch in PyTorch"))
  );
  const nextOverview = already
    ? overview
    : [
        ...overview,
        {
          _type: "block",
          _key: key(12),
          style: "h4",
          markDefs: [],
          children: [{ _type: "span", _key: key(12), marks: [], text: "Architectures evaluated" }],
        },
        {
          _type: "block",
          _key: key(12),
          style: "normal",
          markDefs: [],
          children: [{ _type: "span", _key: key(12), marks: [], text: ARCHITECTURES }],
        },
      ];

  await client
    .patch(doc._id)
    .set({
      gallery,
      mainImage: { _type: "image", asset: { _type: "reference", _ref: uploaded[0] } },
      overview: nextOverview,
    })
    .commit();

  console.log(
    "patched",
    doc._id,
    "- gallery",
    gallery.length,
    already ? "(overview already had the paragraph)" : "- overview extended"
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
