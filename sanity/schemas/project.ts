import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      hidden: true,
      readOnly: true,
      initialValue: "ml-research",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "subcategory",
      title: "Subcategory (optional, free text)",
      type: "string",
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "overview",
      title: "Overview (Case Study)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "description",
      title: "Plain Description (fallback)",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "panorama",
      title: "360° Panorama Images",
      type: "array",
      of: [{ type: "image" }],
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL (YouTube/Vimeo)",
      type: "url",
    }),
    defineField({
      name: "videoFile",
      title: "Video File",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "model3d",
      title: "3D Model (glTF/GLB) — 3D Design only",
      type: "file",
      options: { accept: ".glb,.gltf" },
    }),
    defineField({
      name: "githubUrl",
      title: "GitHub URL (shown in modal for ML & Research)",
      type: "url",
    }),
    defineField({
      name: "youtubeVideoId",
      title: "YouTube Video ID (e.g. cv-PEmzjJyM)",
      type: "string",
    }),
    defineField({
      name: "progressPdfUrl",
      title: "Progress PDF URL",
      type: "url",
    }),
    defineField({ name: "client", title: "Client", type: "string" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "year", title: "Year", type: "number" }),
    defineField({ name: "projectType", title: "Project Type", type: "string" }),
    defineField({
      name: "tools",
      title: "Tools",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "featured",
      title: "Featured on homepage?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order (lower = first)",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "mainImage" },
  },
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
