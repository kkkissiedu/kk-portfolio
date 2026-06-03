import { defineCliConfig } from "sanity/cli";

// After running `npx sanity deploy` once, Sanity will write the new appId
// for the kk-portfolio studio back into this `deployment` block automatically.
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "jv5ghckv",
    dataset: "production",
  },
});
