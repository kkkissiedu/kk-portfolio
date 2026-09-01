// GhanaCrack media.
//
// The 2x2 YOLO FP16 comparison reel (YOLO26-S/N, YOLO11-M/S on Test7) is
// attached as an H.264 MP4, encoded via the imageio-ffmpeg bundled binary.
// A still poster frame from it also leads the gallery. FPS shown on the
// video is inference-only on an RTX 4070 laptop GPU, labelled as such.
//
//
// Run: npx sanity exec scripts/attach-ghanacrack-reel.ts --with-user-token
import { getCliClient } from "sanity/cli";
import fs from "node:fs";
import path from "node:path";

const client = getCliClient({ apiVersion: "2025-08-15" });

// Forward slashes on purpose: a backslashed Windows path in a scanned source
// file is read by Tailwind v4 as a CSS unicode escape and breaks the build.
const ASSET_DIR =
  "C:/Users/kissi/AppData/Local/Temp/claude/D--WORK-FOLDER-THE-ANTHRACITE-WEBSITE/" +
  "231cbe60-9bab-4646-b111-b85a93edb803/scratchpad/robot_assets";
const POSTER = "model-comparison-poster.jpg";
const VIDEO = "yolo_fp16_comparison.mp4";

async function main() {
  const doc = await client.fetch<{ _id: string; gallery?: unknown[] } | null>(
    `*[_type=='project' && slug.current=='ghanacrack-inspection-robot'][0]{_id, gallery}`
  );
  if (!doc) throw new Error("GhanaCrack project not found");

  console.log("Uploading poster...");
  const posterAsset = await client.assets.upload(
    "image",
    fs.readFileSync(path.join(ASSET_DIR, POSTER)),
    { filename: POSTER }
  );
  console.log("  ", posterAsset._id);

  // Idempotent: drop any existing entry pointing at this same asset before
  // prepending, so re-running does not duplicate the poster.
  type GalleryItem = { asset?: { _ref?: string } };
  const existing = ((doc.gallery as GalleryItem[]) ?? []).filter(
    (g) => g?.asset?._ref !== posterAsset._id
  );
  const gallery = [
    {
      _type: "image",
      _key: posterAsset._id,
      asset: { _type: "reference", _ref: posterAsset._id },
    },
    ...existing,
  ];

  console.log("Uploading video...");
  const videoAsset = await client.assets.upload(
    "file",
    fs.readFileSync(path.join(ASSET_DIR, VIDEO)),
    { filename: VIDEO, contentType: "video/mp4" }
  );
  console.log("  ", videoAsset._id);

  await client
    .patch(doc._id)
    .set({
      gallery,
      videoFile: {
        _type: "file",
        asset: { _type: "reference", _ref: videoAsset._id },
      },
    })
    .commit();

  console.log("Patched", doc._id, "- gallery", gallery.length, "images + video attached");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
