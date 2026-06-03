import { Metadata } from "next";
import DisciplineClient from "../_shared/DisciplineClient";
import { getSiteSettings, getProjectsByCategory } from "@/lib/sanity";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "3D Design — Kwabena Kissiedu",
  description:
    "High-fidelity 3D modeling, VR/AR experiences, and synthetic data generation using Blender, ZBrush, Unreal Engine, and Unity.",
  alternates: { canonical: "/work/3d-design" },
};

export default async function ThreeDDesignPage() {
  const [settings, projects] = await Promise.all([
    getSiteSettings(),
    getProjectsByCategory("3d-design"),
  ]);
  return (
    <DisciplineClient
      overline="My Work"
      defaultHeading="3D Design"
      defaultSubtitle="3D modeling, VR/AR environments, and visualisation for product, real estate, and cultural-heritage projects."
      heroHeading={settings?.pages?.threeD?.heroHeading}
      heroSubtitle={settings?.pages?.threeD?.heroSubtitle}
      projects={projects}
    />
  );
}
