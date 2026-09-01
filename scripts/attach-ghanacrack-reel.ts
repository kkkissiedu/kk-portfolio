// GhanaCrack media.
//
// The 2x2 YOLO FP16 comparison reel (YOLO26-S/N, YOLO11-M/S on Test7) is
// attached as an H.264 MP4, encoded via the imageio-ffmpeg bundled binary.
// FPS shown on the video is inference-only on an RTX 4070 laptop GPU,
// labelled as such.
//
// The gallery is no longer touched here. It holds single-image overlays only
// (see replace-ghanacrack-images.ts); a still frame of this 2x2 reel is a
// tiled image and does not belong there.
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
const VIDEO = "yolo_fp16_comparison.mp4";

async function main() {
  const doc = await client.fetch<{ _id: string } | null>(
    `*[_type=='project' && slug.current=='ghanacrack-inspection-robot'][0]{_id}`
  );
  if (!doc) throw new Error("GhanaCrack project not found");

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
      videoFile: {
        _type: "file",
        asset: { _type: "reference", _ref: videoAsset._id },
      },
    })
    .commit();

  console.log("Patched", doc._id, "- video attached");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
