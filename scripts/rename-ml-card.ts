// One-off content migration: rename "ML & Research" -> "ML, Robotics & Research"
// Run: npx sanity exec scripts/rename-ml-card.ts --with-user-token
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-08-15" });

async function main() {
  const doc = await client.fetch(
    `*[_type=='siteSettings'][0]{_id, card1Title, toolkitColumn2Title}`
  );
  if (!doc?._id) throw new Error("siteSettings not found");
  console.log("Before:", doc);
  const res = await client
    .patch(doc._id)
    .set({
      card1Title: "ML, Robotics & Research",
      toolkitColumn2Title: "ML, Robotics & Research",
    })
    .commit();
  console.log("After:", {
    card1Title: res.card1Title,
    toolkitColumn2Title: res.toolkitColumn2Title,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
