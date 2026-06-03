import { defineField, defineType } from "sanity";

export default defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "authors", title: "Authors", type: "string" }),
    defineField({ name: "venue", title: "Venue (Journal / Conference)", type: "string" }),
    defineField({ name: "year", title: "Year", type: "number" }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Accepted", value: "accepted" },
          { title: "Published", value: "published" },
          { title: "In Progress", value: "in-progress" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
      initialValue: "in-progress",
    }),
    defineField({ name: "url", title: "URL (DOI / arXiv / PDF)", type: "url" }),
    defineField({ name: "abstract", title: "Abstract", type: "text", rows: 4 }),
    defineField({
      name: "order",
      title: "Display Order (lower = first)",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "venue" },
  },
});
