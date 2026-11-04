// Applies robot_portfolio_handoff/HANDOFF.md (prepared in the ghanacrack
// project, 2026-11-04) to the inspection robot project.
//
// Text is the handoff's "Long" draft, split into sections, plus its "Short"
// line as the card description. Two deliberate departures from the draft:
//
//   - "3D-printed tyres" is published as "3D-printed wheels". The handoff
//     flagged that one for confirmation ("They look 3D-printed ... Confirm"),
//     and in the photos the white hubs are clearly printed while the black
//     treaded tyres look like moulded rubber pressed onto them. "Wheels" is
//     true either way.
//   - chassis-workbench-solar-panel.jpg is not uploaded. The handoff says to
//     use it only if the solar panel is part of the project; in the frame it
//     is bench clutter behind the robot.
//
// The gallery keeps the existing robot photos and crack overlays, drops a
// duplicate (one asset was referenced twice), and inserts the build photos
// between them. title, slug, mainImage and videoFile are left alone.
//
// Run: npx sanity exec scripts/update-robot-from-handoff.ts --with-user-token
import { getCliClient } from "sanity/cli";
import fs from "node:fs";
import path from "node:path";

const client = getCliClient({ apiVersion: "2025-08-15" });

const DOC_ID = "h2KK84bGijwUf8l3hK5Vi7";

// Forward slashes on purpose: a backslashed Windows path in a scanned source
// file is read by Tailwind v4 as a CSS unicode escape and breaks the build.
const ASSET_DIR =
  "C:/Users/kissi/AppData/Local/Temp/claude/D--WORK-FOLDER-THE-ANTHRACITE-WEBSITE/" +
  "231cbe60-9bab-4646-b111-b85a93edb803/scratchpad/robot_build";

const BUILD_PHOTOS = [
  "robot-drive-electronics.jpg",
  "robot-four-motor-drivers.jpg",
  "robot-chassis-side.jpg",
  "robot-stm32-controller.jpg",
  "robot-ibt2-driver.jpg",
];

const SHORT =
  "Four-wheel-drive prototype that finds and measures cracks in concrete. A " +
  "YOLO segmentation model runs as an INT8 TensorRT engine on a Jetson Orin " +
  "NX, with an iPhone's LiDAR supplying depth for real-world crack sizing.";

const SECTIONS: [string, string][] = [
  [
    "What it does",
    "The Construction Site Monitoring Robot is a work-in-progress inspection " +
      "platform for concrete structures. Its job is to drive along a surface, " +
      "detect cracks, and report how wide they are in millimetres, replacing a " +
      "slow manual inspection.",
  ],
  [
    "Perception",
    "Perception runs entirely on the robot. A YOLO instance-segmentation model, " +
      "trained on concrete-crack imagery, is built as an INT8 TensorRT engine on " +
      "an NVIDIA Jetson Orin NX. It processes a frame in about 6 ms, and in " +
      "held-out testing the INT8 version matched the FP16 baseline within one " +
      "percentage point of mask IoU (0.595 against 0.601) while running roughly " +
      "27% faster. Depth comes from an iPhone 17 Pro Max: its camera and LiDAR " +
      "stream to the Orin over ROS 2, which gives each pixel a distance and lets " +
      "crack width be converted to real units. Using the phone replaced a stereo " +
      "camera or dedicated LiDAR that the budget did not allow.",
  ],
  [
    "Drive electronics",
    "Motion is handled by a separate real-time layer. An STM32F103C8T6 " +
      "microcontroller drives four IBT-2 (BTS7960) motor drivers, one per " +
      "gearmotor, so every wheel can be controlled independently. A buck " +
      "converter supplies the logic rails from the LiPo pack. The chassis is a " +
      "folded galvanised steel tray with 3D-printed wheels.",
  ],
  [
    "Status",
    "The platform is still being developed: field tests and calibration of the " +
      "width measurements against a physical gauge come next.",
  ],
];

// Matches the handoff's software stack. The previous list claimed GPS sensor
// fusion, which nothing in the handoff supports; the IMU now comes from the
// phone alongside colour and depth.
const TOOLS = [
  "Python",
  "PyTorch",
  "Ultralytics YOLO",
  "ONNX",
  "TensorRT",
  "NVIDIA Jetson Orin NX",
  "ROS 2 Humble",
  "STM32",
  "TensorBoard",
];

// Crack-overlay renders already in the gallery. The build photos go in front
// of these and behind the existing robot shots.
const OVERLAY_PREFIX = "ghanacrack-";

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

type GalleryItem = {
  _key?: string;
  _type?: string;
  asset?: { _ref?: string };
  filename?: string;
};

async function main() {
  // The asset _ref is an id, not a filename, so the overlay renders can only
  // be told apart by resolving originalFilename alongside each entry.
  const doc = await client.fetch<{
    _id: string;
    gallery?: GalleryItem[];
  } | null>(
    `*[_id==$id][0]{_id, "gallery": gallery[]{_key, _type, asset, "filename": asset->originalFilename}}`,
    { id: DOC_ID }
  );
  if (!doc) throw new Error(`project ${DOC_ID} not found`);

  // Re-runnable: a build photo already in the gallery is not uploaded again.
  const present = new Set((doc.gallery ?? []).map((g) => g.filename ?? ""));
  const uploaded: string[] = [];
  for (const f of BUILD_PHOTOS.filter((f) => !present.has(f))) {
    const a = await client.assets.upload(
      "image",
      fs.readFileSync(path.join(ASSET_DIR, f)),
      { filename: f }
    );
    console.log("uploaded", f, "->", a._id);
    uploaded.push(a._id);
  }

  // Drop entries with no asset, and any asset repeated later in the list.
  const seen = new Set<string>();
  const existing = (doc.gallery ?? []).filter((g) => {
    const ref = g?.asset?._ref;
    if (!ref || seen.has(ref)) return false;
    seen.add(ref);
    return true;
  });
  const dropped = (doc.gallery ?? []).length - existing.length;

  const asItem = (ref: string) => ({
    _type: "image",
    _key: ref,
    asset: { _type: "reference", _ref: ref },
  });

  const isOverlay = (g: GalleryItem) =>
    (g.filename ?? "").startsWith(OVERLAY_PREFIX);
  const isBuildPhoto = (g: GalleryItem) =>
    BUILD_PHOTOS.includes(g.filename ?? "");

  // Order: the robot as photographed, then the build detail, then the crack
  // renders the model produces.
  const gallery = [
    ...existing.filter((g) => !isOverlay(g) && !isBuildPhoto(g)),
    ...existing.filter(isBuildPhoto),
    ...uploaded.filter((id) => !seen.has(id)).map(asItem),
    ...existing.filter(isOverlay),
  ];

  const clean = gallery.map(({ _key, _type, asset }) => ({ _key, _type, asset }));

  await client
    .patch(doc._id)
    .set({
      shortDescription: SHORT,
      overview: SECTIONS.flatMap(([h, body]) => [
        block("h4", h),
        block("normal", body),
      ]),
      tools: TOOLS,
      gallery: clean,
    })
    .commit();

  console.log(
    `patched ${doc._id} - gallery ${(doc.gallery ?? []).length} -> ${gallery.length}` +
      (dropped ? ` (${dropped} duplicate dropped)` : "")
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
