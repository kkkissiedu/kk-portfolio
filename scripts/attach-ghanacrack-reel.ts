// GhanaCrack media.
//
// The 2x2 model-comparison reel is kept as a still poster frame in the
// gallery. The MP4 itself is NOT attached: OpenCV could only write MPEG-4
// Part 2 (mp4v) on this machine, which browsers refuse to decode
// (MEDIA_ELEMENT_ERROR code 4). A YouTube link via the project's videoUrl /
// youtubeVideoId field is the intended route for the moving version.
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

  await client
    .patch(doc._id)
    .set({ gallery })
    .unset(["videoFile"])   // browser-incompatible codec; use YouTube instead
    .commit();

  console.log("Patched", doc._id, "- gallery now", gallery.length, "images; videoFile unset");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
