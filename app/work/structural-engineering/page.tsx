import { Metadata } from "next";
import DisciplineClient from "../_shared/DisciplineClient";
import { getSiteSettings, getProjectsByCategory } from "@/lib/sanity";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Structural Engineering — Kwabena Kissiedu",
  description:
    "Structural analysis, design, and detailing for residential, commercial, and hospital buildings using ProtaStructure, Revit, AutoCAD, and ABAQUS.",
  alternates: { canonical: "/work/structural-engineering" },
};

export default async function StructuralEngineeringPage() {
  const [settings, projects] = await Promise.all([
    getSiteSettings(),
    getProjectsByCategory("structural-engineering"),
  ]);
  return (
    <DisciplineClient
      overline="My Work"
      defaultHeading="Structural Engineering"
      defaultSubtitle="Precision-engineered structural analysis, design, and detailing — from concept through construction documentation."
      heroHeading={settings?.pages?.structural?.heroHeading}
      heroSubtitle={settings?.pages?.structural?.heroSubtitle}
      projects={projects}
    />
  );
}
