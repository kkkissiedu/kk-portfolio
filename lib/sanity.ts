import { createClient } from "next-sanity";
import { createImageUrlBuilder as imageUrlBuilder } from "@sanity/image-url";
import { cache } from "react";
import type {
  Project,
  Publication,
  Testimonial,
  GalleryGroup,
  ResolvedImage,
  ResolvedFile,
  SanityImageSource,
} from "@/types/sanity";

export type { SanityImageSource };
export type {
  Project,
  Publication,
  Testimonial,
  GalleryGroup,
} from "@/types/sanity";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "jv5ghckv";

export const client = createClient({
  projectId,
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// ─── Site Settings ────────────────────────────────────────────────────

export type ToolkitItemResolved = {
  name: string;
  icon?: ResolvedImage;
};

export type SiteSettings = {
  // Hero
  heroOverline?: string;
  heroTagline?: string;
  heroAccentWord?: string;
  heroSubtitle?: string;
  heroCtaPrimary?: string;
  heroCtaSecondary?: string;
  // About
  aboutLabel?: string;
  aboutHeading?: string;
  aboutHeadingAccentWords?: string;
  aboutBodyPara1?: string;
  aboutBodyPara2?: string;
  aboutPhoto?: ResolvedImage;
  anthraciteUrl?: string;
  academicCv?: ResolvedFile;
  professionalCv?: ResolvedFile;
  statOneValue?: string;
  statOneLabel?: string;
  statTwoValue?: string;
  statTwoLabel?: string;
  statThreeValue?: string;
  statThreeLabel?: string;
  // What I Do
  whatIDoLabel?: string;
  whatIDoHeading?: string;
  whatIDoAccentWord?: string;
  card1Title?: string;
  card1Subtitle?: string;
  card1Description?: string;
  card2Title?: string;
  card2Subtitle?: string;
  card2Description?: string;
  card3Title?: string;
  card3Subtitle?: string;
  card3Description?: string;
  // Channel
  channelLabel?: string;
  channelHeading?: string;
  channelAccentWord?: string;
  channelIntro?: string;
  channelVideoUrl?: string;
  channelChannelUrl?: string;
  channelCtaLabel?: string;
  // Toolkit
  toolkitLabel?: string;
  toolkitHeading?: string;
  toolkitAccentWord?: string;
  toolkitIntro?: string;
  toolkitColumn1Title?: string;
  toolkitColumn1Items?: ToolkitItemResolved[];
  toolkitColumn2Title?: string;
  toolkitColumn2Items?: ToolkitItemResolved[];
  toolkitColumn3Title?: string;
  toolkitColumn3Items?: ToolkitItemResolved[];
  // Contact
  contactLabel?: string;
  contactHeading?: string;
  contactAccentWord?: string;
  contactSubtext?: string;
  contactEmail?: string;
  contactLocation?: string;
  contactGithubUrl?: string;
  contactLinkedinUrl?: string;
  contactYoutubeUrl?: string;
  // Footer
  footerCopyright?: string;
  footerTagline?: string;
  // External discipline URLs
  anthraciteStructuralUrl?: string;
  anthracite3dUrl?: string;
  // Sub-pages
  pages?: {
    structural?: { heroHeading?: string; heroSubtitle?: string };
    ml?: { heroHeading?: string; heroSubtitle?: string };
    threeD?: { heroHeading?: string; heroSubtitle?: string };
  };
};

const imgProjection = `{
  asset-> { _id, url, metadata { dimensions } },
  alt
}`;

const fileProjection = `{
  asset-> { _id, url, originalFilename }
}`;

const toolkitItemProjection = `{
  name,
  icon ${imgProjection}
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  ...,
  anthraciteStructuralUrl,
  anthracite3dUrl,
  aboutPhoto ${imgProjection},
  academicCv ${fileProjection},
  professionalCv ${fileProjection},
  toolkitColumn1Items[] ${toolkitItemProjection},
  toolkitColumn2Items[] ${toolkitItemProjection},
  toolkitColumn3Items[] ${toolkitItemProjection},
  pages {
    structural { heroHeading, heroSubtitle },
    ml { heroHeading, heroSubtitle },
    threeD { heroHeading, heroSubtitle }
  }
}`;

export const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  try {
    return await client.fetch(siteSettingsQuery);
  } catch {
    return null;
  }
});

// ─── Projects ────────────────────────────────────────────────────────

export type FeaturedProject = Project;

const projectProjection = `{
  _id, title, slug, shortDescription, description, overview,
  category, subcategory, "displayOrder": order, client, location, year,
  projectType, tools, videoUrl, panoramaUrl, githubUrl, youtubeVideoId,
  progressPdfUrl, featured,
  videoFile { asset-> { url } },
  model3d { asset-> { url } },
  mainImage { asset-> { _id, url, metadata { dimensions } } },
  gallery[] { asset-> { _id, url, metadata { dimensions } } },
  panorama[] { asset-> { _id, url, metadata { dimensions } } }
}`;

export async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  try {
    return await client.fetch(
      `*[_type == "project" && featured == true] | order(order asc) [0...6] ${projectProjection}`,
      {},
      { next: { revalidate: 60 } }
    );
  } catch {
    return [];
  }
}

export async function getAllProjects(): Promise<FeaturedProject[]> {
  try {
    return await client.fetch(
      `*[_type == "project"] | order(order asc) ${projectProjection}`,
      {},
      { next: { revalidate: 60 } }
    );
  } catch {
    return [];
  }
}

export async function getProjectsByCategory(
  category: string
): Promise<FeaturedProject[]> {
  try {
    return await client.fetch(
      `*[_type == "project" && category == $category] | order(order asc) ${projectProjection}`,
      { category },
      { next: { revalidate: 60 } }
    );
  } catch {
    return [];
  }
}

// ─── Publications ────────────────────────────────────────────────────

export async function getPublications(): Promise<Publication[]> {
  try {
    return await client.fetch(
      `*[_type == "publication"] | order(order asc, year desc) {
        _id, title, authors, venue, year, status, url, abstract, order
      }`,
      {},
      { next: { revalidate: 60 } }
    );
  } catch {
    return [];
  }
}

// ─── Testimonials ────────────────────────────────────────────────────

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    return await client.fetch(
      `*[_type == "testimonial"] | order(order asc, _createdAt asc) {
        _id, quote, name, role, order
      }`,
      {},
      { next: { revalidate: 60 } }
    );
  } catch {
    return [];
  }
}

// ─── Gallery ─────────────────────────────────────────────────────────

export async function getGalleryGroups(): Promise<GalleryGroup[]> {
  try {
    return await client.fetch(
      `*[_type == "galleryGroup"] | order(order asc, _createdAt asc) {
        _id, name, order,
        items[] {
          _key, _type,
          caption,
          youtubeUrl,
          image ${imgProjection}
        }
      }`,
      {},
      { next: { revalidate: 60 } }
    );
  } catch {
    return [];
  }
}
