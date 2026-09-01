// crack-seg-efficientnet project: correct the case study and replace the images.
//
// The overview was carried over from the old site and described a different
// model: "U-Net architecture with attention" and "Dice Score of 0.93", plus an
// unsupported "reduces inspection time by over 70%". The repo README and the
// training code describe EfficientNetSeg, an MBConv/squeeze-excitation encoder
// with a U-Net-style decoder trained from scratch, test IoU 0.6954 / F1 0.8203.
// Every number below is from that README and from evaluate.py.
//
// Images become single overlays of the model's own thresholded output on the
// held-out test split, rendered by scratchpad/render_single_overlays.py. The
// old ccseg_*.webp files came from the previous site.
//
// Run: npx sanity exec scripts/fix-efficientnet-project.ts --with-user-token
import { getCliClient } from "sanity/cli";
import fs from "node:fs";
import path from "node:path";

const client = getCliClient({ apiVersion: "2025-08-15" });

// Forward slashes on purpose: a backslashed Windows path in a scanned source
// file is read by Tailwind v4 as a CSS unicode escape and breaks the build.
const ASSET_DIR =
  "C:/Users/kissi/AppData/Local/Temp/claude/D--WORK-FOLDER-THE-ANTHRACITE-WEBSITE/" +
  "231cbe60-9bab-4646-b111-b85a93edb803/scratchpad/robot_assets/final_effnet";

const IMAGES = [
  "crackseg-efficientnet-01.jpg",
  "crackseg-efficientnet-02.jpg",
  "crackseg-efficientnet-03.jpg",
  "crackseg-efficientnet-04.jpg",
  "crackseg-efficientnet-05.jpg",
];

const SECTIONS: [string, string][] = [
  [
    "Problem",
    "Concrete crack surveys are carried out by eye, which is slow, subjective " +
      "and hard to repeat between inspectors. A pixel-level crack map is more " +
      "useful than a yes or no judgement, because width, length and branching " +
      "are what determine whether a crack matters, and none of those can be " +
      "read off a classification label.",
  ],
  [
    "Approach",
    "EfficientNetSeg is written from scratch in PyTorch with no pretrained " +
      "backbone. The encoder is a stack of MBConv blocks with squeeze-and-" +
      "excitation channel attention; the decoder mirrors it with upsampling " +
      "stages and skip connections, taking 3-channel RGB in and a single-" +
      "channel mask out. Training uses a hybrid loss of weighted BCE and Dice " +
      "at alpha 0.25, where the BCE positive weight is computed from the actual " +
      "background-to-crack pixel ratio of the training masks rather than guessed, " +
      "since cracks occupy a small fraction of every frame. Adam at 1e-4, cosine " +
      "annealing to 1e-6, mixed precision, 512 px inputs, 100 epochs.",
  ],
  [
    "Results",
    "On the held-out test split: IoU 0.6954, F1 0.8203, precision 0.7411 and " +
      "recall 0.9185, from 9.0 M parameters. Recall sitting well above precision " +
      "is the right trade for inspection work, where a missed crack costs far " +
      "more than a false positive an engineer dismisses in a second. The images " +
      "here are the model's thresholded output overlaid on test images it was " +
      "not trained on.",
  ],
  [
    "Comparison study",
    "This is one of five segmentation architectures written and trained on the " +
      "same dataset under the same schedule, so the numbers compare directly " +
      "instead of being borrowed across papers: DeepLabV3+ (59.3 M, IoU 0.7031), " +
      "MobileNetV4 (12.5 M, IoU 0.6930), EfficientNet (9.0 M, IoU 0.6954), " +
      "Attention U-Net (31.4 M, IoU 0.6554), and a classic U-Net baseline still " +
      "in progress. DeepLabV3+ leads, but carries 6.6 times the parameters for " +
      "0.008 IoU over EfficientNet. That gap is the reason the smaller models " +
      "are the ones being carried forward to on-robot deployment.",
  ],
];

const TOOLS = [
  "Python",
  "PyTorch",
  "torchvision",
  "torchmetrics",
  "Weights & Biases",
  "NumPy",
  "Pillow",
  "Mixed-precision training (AMP)",
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
  const doc = await client.fetch<{ _id: string } | null>(
    `*[_type=='project' && slug.current=='efficientnet-based-concrete-crack-segmentation-model'][0]{_id}`
  );
  if (!doc) throw new Error("EfficientNet project not found");

  const uploaded = [];
  for (const f of IMAGES) {
    const a = await client.assets.upload("image", fs.readFileSync(path.join(ASSET_DIR, f)), {
      filename: f,
    });
    console.log("uploaded", f, "->", a._id);
    uploaded.push(a._id);
  }

  const overview = SECTIONS.flatMap(([h, body]) => [block("h4", h), block("normal", body)]);

  await client
    .patch(doc._id)
    .set({
      overview,
      tools: TOOLS,
      mainImage: { _type: "image", asset: { _type: "reference", _ref: uploaded[0] } },
      gallery: uploaded.map((id) => ({
        _type: "image",
        _key: id,
        asset: { _type: "reference", _ref: id },
      })),
    })
    .commit();

  console.log("patched", doc._id, "- overview rewritten,", uploaded.length, "images");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
