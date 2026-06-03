import { Metadata } from "next";
import { getGalleryGroups } from "@/lib/sanity";
import GalleryClient from "./GalleryClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Gallery — Kwabena Kissiedu",
  description:
    "A collection of images and videos from structural engineering, ML research, and 3D design work.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const groups = await getGalleryGroups();
  return <GalleryClient groups={groups} />;
}
