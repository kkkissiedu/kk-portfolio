import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      type: "text",
      rows: 4,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({ name: "role", title: "Role / Affiliation", type: "string" }),
    defineField({
      name: "order",
      title: "Display Order (lower = first)",
      type: "number",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role" },
  },
});
