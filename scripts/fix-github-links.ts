// One-off content fix: correct GitHub links that changed after the
// original import (renamed repos), and update case study text where the
// underlying method changed (BNN -> MC Dropout) or new outcome data
// surfaced (Concrete Strength "The Ark" validation).
// Run: npx sanity exec scripts/fix-github-links.ts --with-user-token
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-08-15" });

function block(text: string, style: "h4" | "normal" = "normal") {
  return {
    _type: "block",
    style,
    children: [{ _type: "span", text }],
  };
}

async function main() {
  // Simple URL fixes — repos renamed, content unchanged.
  const urlFixes: Record<string, string> = {
    "Concrete Crack Segmentation Model":
      "https://github.com/kkkissiedu/Concrete-Crack-Segmentation-Model",
    "Concrete Site Safety Detector":
      "https://github.com/kkkissiedu/Construction-Site-Safety",
    "Uncertainty-Aware Surrogate Modeling":
      "https://github.com/kkkissiedu/Uncertainty-Quantification-for-SHM",
  };

  for (const [title, githubUrl] of Object.entries(urlFixes)) {
    const doc = await client.fetch<{ _id: string } | null>(
      `*[_type=='project' && title==$title][0]{_id}`,
      { title }
    );
    if (!doc) {
      console.log(`SKIP (not found): ${title}`);
      continue;
    }
    await client.patch(doc._id).set({ githubUrl }).commit();
    console.log(`Fixed link: ${title} -> ${githubUrl}`);
  }

  // Concrete Strength Prediction: append the real-world outcome now
  // documented in the repo's README, and fix the link.
  {
    const doc = await client.fetch<{
      _id: string;
      overview: unknown[];
    } | null>(
      `*[_type=='project' && title=='Concrete Strength Prediction'][0]{_id, overview}`
    );
    if (doc) {
      const newOutcome = block(
        "The final model achieved a Root Mean Squared Error of 5.8MPa on the test set. The model has since been used on “The Ark” construction project to select a concrete mix with a 10% higher predicted strength."
      );
      // Replace the last block (the old single-sentence Outcome paragraph)
      const overview = [...(doc.overview as { style?: string }[])];
      const lastIdx = overview.length - 1;
      overview[lastIdx] = newOutcome;
      await client
        .patch(doc._id)
        .set({
          githubUrl:
            "https://github.com/kkkissiedu/CONCRETE-STRENGTH-PREDICTION-RANDOMFOREST-MODEL",
          overview,
        })
        .commit();
      console.log("Fixed link + outcome: Concrete Strength Prediction");
    } else {
      console.log("SKIP (not found): Concrete Strength Prediction");
    }
  }

  // BNN Crack Classifier: the repo was rewritten to use MC Dropout on a
  // ResNet18 backbone rather than a full Bayesian Neural Network / Pyro.
  // Title and case study are updated to describe the actual method.
  {
    const doc = await client.fetch<{ _id: string } | null>(
      `*[_type=='project' && title=='Probabilistic Damage Classification with BNNs'][0]{_id}`
    );
    if (doc) {
      const overview = [
        block("Problem", "h4"),
        block(
          "Standard deep learning models for damage classification often act as 'black boxes,' providing predictions without indicating their confidence. This is a significant drawback for safety-critical engineering applications where understanding a model's uncertainty is crucial."
        ),
        block("Process", "h4"),
        block(
          "A ResNet18 backbone was fine-tuned for binary classification of concrete surface images (Cracked / Intact) with Monte Carlo Dropout enabled at inference time. Running multiple stochastic forward passes per image approximates Bayesian inference, allowing the model to quantify its uncertainty for each prediction via predictive entropy and mutual information."
        ),
        block("Outcome", "h4"),
        block(
          "The model classifies concrete images as cracked or uncracked while also providing a per-prediction uncertainty measure. This probabilistic approach is critical for building more reliable and trustworthy AI systems for structural health monitoring, allowing engineers to identify predictions the model is uncertain about for further review."
        ),
      ];
      await client
        .patch(doc._id)
        .set({
          title: "Probabilistic Damage Classification with MC Dropout",
          shortDescription:
            "A Monte Carlo Dropout model that classifies concrete damage while quantifying its own prediction uncertainty.",
          githubUrl:
            "https://github.com/kkkissiedu/Probabilistic-Crack-Detection-with-MC-Dropout",
          overview,
          tools: [
            "Python",
            "PyTorch",
            "Monte Carlo (MC) Dropout",
            "ResNet18",
            "Uncertainty Quantification",
            "Scikit-learn",
            "Jupyter Notebook",
          ],
        })
        .commit();
      console.log("Updated method + link: BNN -> MC Dropout Crack Classifier");
    } else {
      console.log("SKIP (not found): Probabilistic Damage Classification with BNNs");
    }
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
