// One-off content migration: import ML/Research projects from
// OLD_WEBSITE/js/projects-data.js into Sanity. Structural Engineering
// projects are intentionally excluded — those live on the company
// (Anthracite) site, which the portfolio already links out to.
// Run: npx sanity exec scripts/import-old-projects.ts --with-user-token
import { getCliClient } from "sanity/cli";
import fs from "node:fs";
import path from "node:path";

const client = getCliClient({ apiVersion: "2025-08-15" });
const ROOT = path.resolve(__dirname, "..");
const OLD = path.join(ROOT, "OLD_WEBSITE");

type CaseStudy = { problem?: string; process?: string; outcome?: string };
type OldProject = {
  id: string;
  order: number;
  category: "engineering" | "ml-research" | "design";
  title: string;
  short_description: string;
  cover_image: string;
  github_link?: string;
  slideshow_images: string[];
  case_study: CaseStudy;
  technologies: string[];
};

// Only ML/Research is imported by this script.
const CATEGORY_MAP: Record<string, string> = {
  "ml-research": "ml-research",
};

const projects: OldProject[] = [
  {
    id: "modal-5", order: 1, category: "ml-research",
    title: "Concrete Crack Segmentation Model",
    short_description: "A CNN model for semantic segmentation of cracks in concrete surfaces from images.",
    cover_image: "images/projects/ML/ccseg_main.webp",
    github_link: "https://github.com/kkkissiedu/Concrete-Crack-Segmentation",
    slideshow_images: [
      "images/projects/ML/ccseg_main.webp",
      "images/projects/ML/ccseg_1.webp",
      "images/projects/ML/ccseg_2.jpg",
      "images/projects/ML/ccseg_3.jpg",
    ],
    case_study: {
      problem: "Manual inspection of concrete infrastructure for cracks is time-consuming, expensive, and prone to human error. There was a need for an automated system to improve the speed and accuracy of structural health monitoring.",
      process: "A Convolutional Neural Network (CNN) was designed and trained using PyTorch on a large dataset of concrete surface images. It was built on a U-Net architecture with attention mechanisms. Class weighting was incorporated to handle class imbalance, and data augmentation techniques were applied to enhance model robustness.",
      outcome: "A semantic segmentation model that is able to detect and outline cracks in concrete images. The final model achieved a Dice Score of 0.93 on the test set. This automated system reduces inspection time by over 70% and enables proactive maintenance, significantly enhancing the safety and longevity of civil infrastructure.",
    },
    technologies: ["Python & Jupyter Notebooks", "PyTorch", "Convolutional Neural Networks (CNN)", "OpenCV for Image Processing", "Albumentations for Data Augmentation", "scikit-learn and Dice Score for Evaluation"],
  },
  {
    id: "modal-6", order: 8, category: "ml-research",
    title: "Concrete Strength Prediction",
    short_description: "A Random Forest Regressor Model for estimating the Compressive Strength of Concrete",
    cover_image: "images/projects/ML/csp_main.webp",
    github_link: "https://github.com/kkkissiedu/Concrete-Strength-Prediction-Model",
    slideshow_images: [
      "images/projects/ML/csp_main.webp",
      "images/projects/ML/csp3.png",
      "images/projects/ML/csp1.png",
      "images/projects/ML/csp2.png",
    ],
    case_study: {
      problem: "This project applies machine learning to a core civil engineering challenge: predicting the compressive strength of concrete. It provides a faster, data-driven method.",
      process: "Linear Regression, Decision Tree and Random Forest Regressor models were trained using a concrete strength dataset. The model with the highest r-squared error was selected. Hyperparameter tuning was performed using KFold and GridSearch. After visualizing feature importances, the low-impact features were removed, after which the model was updated.",
      outcome: "The final model achieved a Root Mean Squared Error of 5.8MPa on the test set.",
    },
    technologies: ["Python & Jupyter Notebooks", "Scikit-learn", "RandomForestRegressor", "Matplotlib", "Seaborn", "GridSearchCV"],
  },
  {
    id: "modal-7", order: 7, category: "ml-research",
    title: "Concrete Site Safety Detector",
    short_description: "AI-powered system for real-time monitoring of Personal Protective Equipment (PPE) compliance on construction sites.",
    cover_image: "images/projects/ML/css_main.webp",
    github_link: "https://github.com/kkkissiedu/Concrete-Site-Safety-Detector",
    slideshow_images: [
      "images/projects/ML/css_main.webp",
      "images/projects/ML/css1.webp",
      "images/projects/ML/css2.webp",
    ],
    case_study: {
      problem: "Construction sites are hazardous environments where failure to comply with PPE regulations significantly increases the risk of accidents. Manual enforcement is time-consuming, inconsistent, and prone to human error.",
      process: "A deep learning-based computer vision model based on YOLOv8 was trained on annotated images to detect workers and identify whether they are wearing required PPE such as helmets, vests, and boots. The system uses object detection algorithms integrated into a real-time monitoring pipeline.",
      outcome: "The model successfully detects PPE compliance in real-time video streams with minimal latency. This model serves as a foundation for a more advanced system incorporating dense captioning to provide contextual risk assessment, moving from simple detection to intelligent scene understanding.",
    },
    technologies: ["Python & Jupyter Notebooks", "PyTorch", "OpenCV", "YOLOv8", "CVZone"],
  },
  {
    id: "modal-8", order: 9, category: "ml-research",
    title: "Earthquake Response Spectrum Estimator",
    short_description: "Python script for quickly generating response spectra for earthquake engineering.",
    cover_image: "images/projects/ML/ers_main.webp",
    github_link: "https://github.com/kkkissiedu/Earthquake-Response-Spectrum",
    slideshow_images: [
      "images/projects/ML/ers_main.webp",
      "images/projects/ML/ers1.png",
    ],
    case_study: {
      problem: "Engineering professionals and researchers often need to compute earthquake response spectra from ground motion records to assess structural seismic demands.",
      process: "The script uses Pandas for data handling, NumPy for numerical computations, and Matplotlib for plotting. It reads earthquake ground motion data, computes the response spectrum using a Single-Degree-of-Freedom (SDOF) system model based on the Central Difference Method, and visualizes the results.",
      outcome: "The script determines the dynamic response of a Single-Degree-of-Freedom (SDOF) system subjected to earthquake ground motion. The classic 1940 El Centro earthquake ground motion was used as a case study for the script. The script generates the response spectrum, which is a crucial tool for earthquake engineering analysis.",
    },
    technologies: ["Python & Jupyter Notebooks", "Central Difference Method", "Numpy", "Pandas", "Matplotlib"],
  },
  {
    id: "modal-9", order: 6, category: "ml-research",
    title: "Fatigue Life of Locally Manufactured Rebars",
    short_description: "Laboratory testing and Numerical simulation of Fatigue Life of Locally Manufactured Rebars",
    cover_image: "images/projects/ML/FLR_main.webp",
    slideshow_images: [
      "images/projects/ML/FLR_main.webp",
      "images/projects/ML/FLR.webp",
      "images/projects/ML/FLR_1.webp",
      "images/projects/ML/FLR_2.webp",
    ],
    case_study: {
      problem: "Though the majority of rebars used in construction of residential and commercial buildings in Ghana are locally-sourced, there is a lack of extensive research into the fatigue life of these rebars under low-cycle, high intensity loading.",
      process: "Laboratory testing of the mechanical properties of locally manufactured rebars sourced from a number of local manufacturers. Experimental results are used in generating numerical models in ABAQUS for simulation of the fatigue life of the rebars under several conditions including change in bar diameter, tensile strength and rib geometry. The results will be used in building a Neural Network model for estimating Fatigue Life of any given type of locally manufactured rebar.",
      outcome: "Comprehensive database on the Fatigue Life of locally manufactured rebars. Research outcome will assess the suitability of the rebars for sustainable construction. The Neural Network model will make further studies on the topic easier and less expensive.",
    },
    technologies: ["Laboratory Tests", "ABAQUS", "Concrete Damage Plasticity", "Python & Jupyter Notebooks", "Numpy", "Pandas", "Matplotlib", "Convolutional Neural Networks (CNN)", "OpenCV for Image Processing", "Albumentations for Data Augmentation"],
  },
  {
    id: "modal-10", order: 20, category: "ml-research",
    title: "Traffic Car Counter",
    short_description: "Realtime Car Counter based on YOLOv8",
    cover_image: "images/projects/ML/tcc_main.webp",
    github_link: "https://github.com/kkkissiedu/Traffic-Car-Counter",
    slideshow_images: [
      "images/projects/ML/tcc_main.webp",
      "images/projects/ML/tcc.webp",
      "images/projects/ML/tcc_1.webp",
    ],
    case_study: {
      problem: "Manual traffic counting is inefficient and prone to errors. An automated system was needed for accurate, real-time vehicle tracking and counting for traffic management applications.",
      process: "OpenCV and CVZone were utilized for processing of video feed. The model backbone was built on YOLOv8 for detection and the SORT algorithm for robust object tracking across frames.",
      outcome: "A realtime computer vision model that detects multiple vehicle types, assigns unique IDs to each instance, and counts vehicles as they cross a defined virtual line.",
    },
    technologies: ["Python & Jupyter Notebooks", "PyTorch", "OpenCV", "cvzone", "YOLOv8", "SORT"],
  },
  {
    id: "modal-16", order: 2, category: "ml-research",
    title: "Synthetic Concrete Crack Generation with VAEs",
    short_description: "A Variational Autoencoder (VAE) trained to generate high-fidelity, synthetic concrete crack images to solve data scarcity.",
    cover_image: "images/projects/ML/vae_main.webp",
    github_link: "https://github.com/kkkissiedu/VAE-Crack-Synthesis",
    slideshow_images: [
      "images/projects/ML/vae_main.webp",
      "images/projects/ML/vae.webp",
      "images/projects/ML/vae_1.webp",
    ],
    case_study: {
      problem: "A significant challenge in developing robust computer vision models for structural health monitoring is the scarcity of diverse, high-quality data. Manually collecting and annotating thousands of crack images is impractical and expensive.",
      process: "A Variational Autoencoder (VAE) was built and trained in PyTorch on a dataset of concrete crack images. The VAE learns a compressed, latent representation of the data, allowing it to generate entirely new, realistic images of concrete cracks by sampling from this learned latent space.",
      outcome: "The trained model successfully generates high-fidelity, synthetic images of concrete cracks. This provides a scalable and cost-effective solution to data scarcity, enabling the creation of larger and more diverse datasets for training other computer vision models, like the U-Net segmentation model.",
    },
    technologies: ["Python", "PyTorch", "Variational Autoencoder (VAE)", "Generative Models", "NumPy", "Matplotlib", "Jupyter Notebook"],
  },
  {
    id: "modal-17", order: 4, category: "ml-research",
    title: "Uncertainty-Aware Surrogate Modeling",
    short_description: "Comparing Gaussian Process Regressors and Deep Ensembles for predicting concrete strength with uncertainty quantification.",
    cover_image: "images/projects/ML/surrogate_main.webp",
    github_link: "https://github.com/kkkissiedu/Uncertainty-Aware-Surrogate-Modeling",
    slideshow_images: [
      "images/projects/ML/surrogate_main.webp",
      "images/projects/ML/surrogate_1.webp",
      "images/projects/ML/surrogate_2.webp",
    ],
    case_study: {
      problem: "Traditional predictive models in engineering often provide point estimates without quantifying their own confidence. For safety-critical applications like predicting concrete strength, it's crucial to have reliable uncertainty bounds for each prediction.",
      process: "Two advanced probabilistic modeling techniques were implemented and compared: Gaussian Process Regressors (GPR) and Deep Ensembles with Aleatoric Uncertainty. Both models were trained on the same concrete compressive strength dataset to create reliable surrogate models that could predict strength and quantify uncertainty.",
      outcome: "Both models successfully produced reliable predictions for concrete compressive strength, complete with principled uncertainty bounds. This work demonstrates a robust methodology for creating uncertainty-aware models, which are essential for risk assessment and decision-making in structural engineering.",
    },
    technologies: ["Python", "PyTorch", "Scikit-learn", "Gaussian Process Regressor (GPR)", "Deep Ensembles", "Uncertainty Quantification", "Pandas", "Matplotlib", "Jupyter Notebook"],
  },
  {
    id: "modal-18", order: 3, category: "ml-research",
    title: "PINN for Beam Deflection",
    short_description: "A Physics-Informed Neural Network (PINN) that solves the Euler-Bernoulli beam equation for deflection analysis.",
    cover_image: "images/projects/ML/pinn_main.webp",
    github_link: "https://github.com/kkkissiedu/PINN-for-Beam-Deflection",
    slideshow_images: [
      "images/projects/ML/pinn_main.webp",
      "images/projects/ML/pinn.webp",
    ],
    case_study: {
      problem: "Traditional numerical methods like the Finite Element Method (FEM) for solving differential equations can be computationally expensive and require extensive domain meshing. There is a need for an alternative, meshless approach that leverages deep learning.",
      process: "A Physics-Informed Neural Network (PINN) was built in PyTorch. The model's loss function was designed to enforce the governing PDE of the Euler-Bernoulli beam theory and its boundary conditions directly, allowing the network to learn the physically correct solution without labeled training data.",
      outcome: "The trained PINN successfully solved the Euler-Bernoulli equation, accurately predicting the deflection of a simply supported beam under a uniform load. This project demonstrates the potential of PINNs as a powerful, mesh-free tool for solving complex engineering problems.",
    },
    technologies: ["Python", "PyTorch", "Physics-Informed Neural Network (PINN)", "Deep Learning", "Euler-Bernoulli Beam Theory", "Matplotlib", "Jupyter Notebook"],
  },
  {
    id: "modal-19", order: 5, category: "ml-research",
    title: "Probabilistic Damage Classification with BNNs",
    short_description: "A Bayesian Neural Network (BNN) that classifies concrete damage while quantifying its own prediction uncertainty.",
    cover_image: "images/projects/ML/bnn_main.webp",
    github_link: "https://github.com/kkkissiedu/BNN-Crack-Classifier",
    slideshow_images: [
      "images/projects/ML/bnn_main.webp",
      "images/projects/ML/bnn.webp",
    ],
    case_study: {
      problem: "Standard deep learning models for damage classification often act as 'black boxes,' providing predictions without indicating their confidence. This is a significant drawback for safety-critical engineering applications where understanding a model's uncertainty is crucial.",
      process: "A Bayesian Neural Network (BNN) was implemented using PyTorch and Pyro. Unlike a standard CNN, the BNN learns a distribution over its weights, allowing it to perform approximate Bayesian inference. This enables the model to quantify its uncertainty for each prediction.",
      outcome: "The BNN successfully classifies concrete images as cracked or uncracked while also providing a measure of its predictive uncertainty. This probabilistic approach is critical for building more reliable and trustworthy AI systems for structural health monitoring, allowing engineers to identify predictions that the model is uncertain about for further review.",
    },
    technologies: ["Python", "PyTorch", "Pyro (Probabilistic Programming)", "Bayesian Neural Network (BNN)", "Uncertainty Quantification", "Scikit-learn", "Jupyter Notebook"],
  },
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 96);
}

function toPortableText(cs: CaseStudy) {
  const blocks: { section: string; text?: string }[] = [
    { section: "Problem", text: cs.problem },
    { section: "Process", text: cs.process },
    { section: "Outcome", text: cs.outcome },
  ];
  return blocks
    .filter((b) => b.text)
    .flatMap((b) => [
      {
        _type: "block",
        style: "h4",
        children: [{ _type: "span", text: b.section }],
      },
      {
        _type: "block",
        style: "normal",
        children: [{ _type: "span", text: b.text! }],
      },
    ]);
}

// Cache so a cover image reused as its own first slideshow entry is only
// uploaded once.
const assetCache = new Map<string, string>(); // relative path -> asset _id

async function uploadImage(relPath: string): Promise<string> {
  const cached = assetCache.get(relPath);
  if (cached) return cached;
  const absPath = path.join(OLD, relPath);
  const buffer = fs.readFileSync(absPath);
  const asset = await client.assets.upload("image", buffer, {
    filename: path.basename(relPath),
  });
  assetCache.set(relPath, asset._id);
  return asset._id;
}

async function main() {
  console.log(`Importing ${projects.length} projects...`);

  for (const p of projects) {
    const category = CATEGORY_MAP[p.category];
    if (!category) {
      console.log(`Skipping ${p.title} (category ${p.category} not imported by this script)`);
      continue;
    }

    process.stdout.write(`- ${p.title} ... `);

    const mainImageAssetId = await uploadImage(p.cover_image);
    const galleryAssetIds: string[] = [];
    for (const img of p.slideshow_images) {
      galleryAssetIds.push(await uploadImage(img));
    }

    const doc = {
      _type: "project",
      title: p.title,
      slug: { _type: "slug", current: slugify(p.title) },
      category,
      shortDescription: p.short_description,
      overview: toPortableText(p.case_study),
      mainImage: {
        _type: "image",
        asset: { _type: "reference", _ref: mainImageAssetId },
      },
      gallery: galleryAssetIds.map((id) => ({
        _type: "image",
        _key: id,
        asset: { _type: "reference", _ref: id },
      })),
      ...(p.github_link ? { githubUrl: p.github_link } : {}),
      tools: p.technologies,
      order: p.order,
      featured: false,
    };

    const created = await client.create(doc);
    console.log(`done (${created._id})`);
  }

  console.log("Import complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
