import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleryGroup",
  title: "Gallery Group",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Group Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order (lower = first)",
      type: "number",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [
        {
          name: "imageItem",
          title: "Image",
          type: "object",
          fields: [
            { name: "image", title: "Image", type: "image", options: { hotspot: true } },
            { name: "caption", title: "Caption", type: "string" },
          ],
          preview: { select: { media: "image", title: "caption" } },
        },
        {
          name: "youtubeItem",
          title: "YouTube Video",
          type: "object",
          fields: [
            { name: "youtubeUrl", title: "YouTube URL", type: "url" },
            { name: "caption", title: "Caption", type: "string" },
          ],
          preview: { select: { title: "caption", subtitle: "youtubeUrl" } },
        },
      ],
    }),
  ],
  preview: { select: { title: "name" } },
});
