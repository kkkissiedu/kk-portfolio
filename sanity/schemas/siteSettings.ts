import { defineField, defineType } from "sanity";

const toolkitItem = {
  name: "toolkitItem",
  title: "Toolkit Item",
  type: "object",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (r: any) => r.required() },
    { name: "icon", title: "Icon", type: "image", options: { hotspot: false } },
  ],
  preview: {
    select: { title: "name", media: "icon" },
  },
};

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "about", title: "About" },
    { name: "whatIDo", title: "What I Do" },
    { name: "channel", title: "From the Channel" },
    { name: "toolkit", title: "My Toolkit" },
    { name: "contact", title: "Contact" },
    { name: "footer", title: "Footer" },
    { name: "pages", title: "Sub-page Heroes" },
  ],
  fields: [
    // ─── Hero ────────────────────────────────────────────────────────────
    defineField({ name: "heroOverline", title: "Overline", type: "string", group: "hero", initialValue: "Kwabena Kwayisi Kissiedu" }),
    defineField({ name: "heroTagline", title: "Tagline", type: "string", group: "hero", initialValue: "Engineering the Future with Data & Design" }),
    defineField({ name: "heroAccentWord", title: "Accent Word (highlighted in heading)", type: "string", group: "hero", initialValue: "Data" }),
    defineField({
      name: "heroSubtitle",
      title: "Subtitle",
      type: "text",
      rows: 3,
      group: "hero",
      initialValue:
        "A First Class Honors Civil Engineer developing AI-driven tools for safer, more sustainable infrastructure through a complete workflow from 3D synthetic data generation to physics-informed modeling.",
    }),
    defineField({ name: "heroCtaPrimary", title: "Primary CTA Label", type: "string", group: "hero", initialValue: "View My Work" }),
    defineField({ name: "heroCtaSecondary", title: "Secondary CTA Label", type: "string", group: "hero", initialValue: "Get in Touch" }),

    // ─── About ───────────────────────────────────────────────────────────
    defineField({ name: "aboutLabel", title: "Label", type: "string", group: "about", initialValue: "About" }),
    defineField({ name: "aboutHeading", title: "Heading", type: "string", group: "about", initialValue: "Research-focused Engineer building intelligent infrastructure" }),
    defineField({ name: "aboutHeadingAccentWords", title: "Heading Accent Word", type: "string", group: "about", initialValue: "intelligent" }),
    defineField({
      name: "aboutBodyPara1",
      title: "Body Paragraph 1",
      type: "text",
      rows: 5,
      group: "about",
      initialValue:
        "I am a research-focused Civil Engineer passionate about applying cutting-edge AI to solve real-world infrastructure challenges in Ghana. My work integrates Physics-Informed AI, computational mechanics, and design automation into a complete workflow: I create 3D digital worlds, use them to generate synthetic data, and then train the physics-informed models needed for analysis.",
    }),
    defineField({
      name: "aboutBodyPara2",
      title: "Body Paragraph 2",
      type: "text",
      rows: 5,
      group: "about",
      initialValue:
        "This passion led me to co-found The Anthracite Ltd., a startup with the mission to develop Ghana's first 3D-printed Green Building estate. My ultimate goal is to pioneer a new paradigm where structures are built with and managed by intelligent digital twins throughout their entire lifespan.",
    }),
    defineField({ name: "aboutPhoto", title: "Portrait Photo", type: "image", group: "about", options: { hotspot: true } }),
    defineField({ name: "anthraciteUrl", title: "The Anthracite URL", type: "url", group: "about", initialValue: "https://theanthracite.com" }),
    defineField({ name: "academicCv", title: "Academic CV (PDF)", type: "file", group: "about", options: { accept: ".pdf" } }),
    defineField({ name: "professionalCv", title: "Professional CV (PDF)", type: "file", group: "about", options: { accept: ".pdf" } }),
    defineField({ name: "statOneValue", title: "Stat 1 Value", type: "string", group: "about", initialValue: "20+" }),
    defineField({ name: "statOneLabel", title: "Stat 1 Label", type: "string", group: "about", initialValue: "Projects shipped" }),
    defineField({ name: "statTwoValue", title: "Stat 2 Value", type: "string", group: "about", initialValue: "3" }),
    defineField({ name: "statTwoLabel", title: "Stat 2 Label", type: "string", group: "about", initialValue: "Disciplines" }),
    defineField({ name: "statThreeValue", title: "Stat 3 Value", type: "string", group: "about", initialValue: "1" }),
    defineField({ name: "statThreeLabel", title: "Stat 3 Label", type: "string", group: "about", initialValue: "First Class Honours, KNUST" }),

    // ─── What I Do ───────────────────────────────────────────────────────
    defineField({ name: "whatIDoLabel", title: "Label", type: "string", group: "whatIDo", initialValue: "What I Do" }),
    defineField({ name: "whatIDoHeading", title: "Heading", type: "string", group: "whatIDo", initialValue: "Three disciplines, one workflow" }),
    defineField({ name: "whatIDoAccentWord", title: "Heading Accent Word", type: "string", group: "whatIDo", initialValue: "workflow" }),
    defineField({ name: "card1Title", title: "Card 1 Title", type: "string", group: "whatIDo", initialValue: "ML & Research" }),
    defineField({ name: "card1Subtitle", title: "Card 1 Subtitle", type: "string", group: "whatIDo" }),
    defineField({ name: "card1Description", title: "Card 1 Description", type: "text", rows: 3, group: "whatIDo", initialValue: "Developing custom computer vision models (U-Net, YOLOv8) for SHM and site safety, and building Physics-Informed Neural Networks (PINNs) for predictive analysis." }),
    defineField({ name: "card2Title", title: "Card 2 Title", type: "string", group: "whatIDo", initialValue: "Structural Engineering" }),
    defineField({ name: "card2Subtitle", title: "Card 2 Subtitle", type: "string", group: "whatIDo" }),
    defineField({ name: "card2Description", title: "Card 2 Description", type: "text", rows: 3, group: "whatIDo", initialValue: "Applying modern computational tools to traditional structural analysis, including physics-based numerical modeling in ABAQUS and advanced BIM workflows in Autodesk Revit." }),
    defineField({ name: "card3Title", title: "Card 3 Title", type: "string", group: "whatIDo", initialValue: "3D Design" }),
    defineField({ name: "card3Subtitle", title: "Card 3 Subtitle", type: "string", group: "whatIDo" }),
    defineField({ name: "card3Description", title: "Card 3 Description", type: "text", rows: 3, group: "whatIDo", initialValue: "Creating high-fidelity 3D assets and immersive digital environments using Blender, ZBrush, and Unreal Engine for synthetic data generation and virtual reality experiences." }),

    // ─── Channel ─────────────────────────────────────────────────────────
    defineField({ name: "channelLabel", title: "Label", type: "string", group: "channel", initialValue: "From the Channel" }),
    defineField({ name: "channelHeading", title: "Heading", type: "string", group: "channel", initialValue: "Tutorials, project showcases, and AI insights" }),
    defineField({ name: "channelAccentWord", title: "Heading Accent Word", type: "string", group: "channel", initialValue: "insights" }),
    defineField({ name: "channelIntro", title: "Intro", type: "text", rows: 2, group: "channel", initialValue: "Tutorials, project showcases, and insights into the world of engineering and AI." }),
    defineField({ name: "channelVideoUrl", title: "Featured Video URL", type: "url", group: "channel", initialValue: "https://www.youtube.com/watch?v=GREgRXG-fbo" }),
    defineField({ name: "channelChannelUrl", title: "Channel URL", type: "url", group: "channel", initialValue: "http://www.youtube.com/@kkkissiedu" }),
    defineField({ name: "channelCtaLabel", title: "CTA Label", type: "string", group: "channel", initialValue: "Visit My Channel" }),

    // ─── Toolkit ─────────────────────────────────────────────────────────
    defineField({ name: "toolkitLabel", title: "Label", type: "string", group: "toolkit", initialValue: "My Toolkit" }),
    defineField({ name: "toolkitHeading", title: "Heading", type: "string", group: "toolkit", initialValue: "Tools I bring ideas to life with" }),
    defineField({ name: "toolkitAccentWord", title: "Heading Accent Word", type: "string", group: "toolkit", initialValue: "ideas" }),
    defineField({ name: "toolkitIntro", title: "Intro", type: "text", rows: 2, group: "toolkit", initialValue: "The primary tools and technologies I use to bring ideas to life." }),
    defineField({ name: "toolkitColumn1Title", title: "Column 1 Title", type: "string", group: "toolkit", initialValue: "Structural Engineering" }),
    defineField({ name: "toolkitColumn1Items", title: "Column 1 Items", type: "array", group: "toolkit", of: [toolkitItem as any] }),
    defineField({ name: "toolkitColumn2Title", title: "Column 2 Title", type: "string", group: "toolkit", initialValue: "ML & Research" }),
    defineField({ name: "toolkitColumn2Items", title: "Column 2 Items", type: "array", group: "toolkit", of: [toolkitItem as any] }),
    defineField({ name: "toolkitColumn3Title", title: "Column 3 Title", type: "string", group: "toolkit", initialValue: "3D Design" }),
    defineField({ name: "toolkitColumn3Items", title: "Column 3 Items", type: "array", group: "toolkit", of: [toolkitItem as any] }),

    // ─── Contact ─────────────────────────────────────────────────────────
    defineField({ name: "contactLabel", title: "Label", type: "string", group: "contact", initialValue: "Get In Touch" }),
    defineField({ name: "contactHeading", title: "Heading", type: "string", group: "contact", initialValue: "Let's Connect" }),
    defineField({ name: "contactAccentWord", title: "Heading Accent Word", type: "string", group: "contact", initialValue: "Connect" }),
    defineField({ name: "contactSubtext", title: "Subtext", type: "text", rows: 3, group: "contact", initialValue: "Have a project in mind or just want to say hi? Feel free to reach out." }),
    defineField({ name: "contactEmail", title: "Email", type: "string", group: "contact", initialValue: "kissiedukwabena4@gmail.com" }),
    defineField({ name: "contactLocation", title: "Location", type: "string", group: "contact", initialValue: "Kumasi, Ghana" }),
    defineField({ name: "contactGithubUrl", title: "GitHub URL", type: "url", group: "contact", initialValue: "https://github.com/kkkissiedu" }),
    defineField({ name: "contactLinkedinUrl", title: "LinkedIn URL", type: "url", group: "contact" }),
    defineField({ name: "contactYoutubeUrl", title: "YouTube URL", type: "url", group: "contact", initialValue: "http://www.youtube.com/@kkkissiedu" }),

    // ─── Footer ──────────────────────────────────────────────────────────
    defineField({ name: "footerCopyright", title: "Copyright", type: "string", group: "footer", initialValue: "© 2026 Kwabena Kissiedu. All Rights Reserved." }),
    defineField({ name: "footerTagline", title: "Tagline", type: "string", group: "footer", initialValue: "Kumasi, Ghana" }),

    // ─── Sub-page heroes ─────────────────────────────────────────────────
    defineField({
      name: "pages",
      title: "Sub-page Heroes",
      type: "object",
      group: "pages",
      fields: [
        {
          name: "structural",
          title: "Structural Engineering",
          type: "object",
          fields: [
            { name: "heroHeading", type: "string", title: "Heading" },
            { name: "heroSubtitle", type: "text", rows: 2, title: "Subtitle" },
          ],
        },
        {
          name: "ml",
          title: "ML & Research",
          type: "object",
          fields: [
            { name: "heroHeading", type: "string", title: "Heading" },
            { name: "heroSubtitle", type: "text", rows: 2, title: "Subtitle" },
          ],
        },
        {
          name: "threeD",
          title: "3D Design",
          type: "object",
          fields: [
            { name: "heroHeading", type: "string", title: "Heading" },
            { name: "heroSubtitle", type: "text", rows: 2, title: "Subtitle" },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "heroOverline" },
    prepare: () => ({ title: "Site Settings" }),
  },
});
