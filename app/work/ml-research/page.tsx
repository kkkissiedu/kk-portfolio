import { Metadata } from "next";
import DisciplineClient from "../_shared/DisciplineClient";
import {
  getSiteSettings,
  getProjectsByCategory,
  getPublications,
} from "@/lib/sanity";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "ML, Robotics & Research — Kwabena Kissiedu",
  description:
    "Custom computer vision models, Physics-Informed Neural Networks, and probabilistic deep learning for structural health monitoring and predictive analysis.",
  alternates: { canonical: "/work/ml-research" },
};

export default async function MLResearchPage() {
  const [settings, projects, publications] = await Promise.all([
    getSiteSettings(),
    getProjectsByCategory("ml-research"),
    getPublications(),
  ]);
  return (
    <DisciplineClient
      overline="My Work"
      defaultHeading="ML, Robotics & Research"
      defaultSubtitle="Computer vision, Physics-Informed Neural Networks, Bayesian deep learning, and surrogate modeling for civil infrastructure."
      heroHeading={settings?.pages?.ml?.heroHeading}
      heroSubtitle={settings?.pages?.ml?.heroSubtitle}
      projects={projects}
      publications={publications}
    />
  );
}
