import type { SanityImageSource } from "@sanity/image-url";

export type { SanityImageSource };

export type SanityPortableTextBlock = {
  _type: string;
  _key?: string;
  style?: string;
  children?: { _type: string; text: string; marks?: string[] }[];
};

export type ResolvedImage = {
  asset: {
    _id: string;
    url: string;
    metadata?: {
      dimensions?: { width: number; height: number; aspectRatio: number };
    };
  };
  alt?: string;
};

export type ResolvedFile = {
  asset: {
    _id: string;
    url: string;
    originalFilename?: string;
  };
};

export type ProjectCategory =
  | "structural-engineering"
  | "ml-research"
  | "3d-design";

export type Project = {
  _id: string;
  title: string;
  slug?: { current: string };
  category: ProjectCategory | string;
  subcategory?: string;
  shortDescription?: string;
  description?: string;
  overview?: SanityPortableTextBlock[];
  mainImage?: ResolvedImage;
  gallery?: ResolvedImage[];
  panorama?: ResolvedImage[];
  displayOrder?: number;
  videoUrl?: string;
  videoFile?: { asset: { url: string } };
  model3d?: { asset: { url: string } };
  panoramaUrl?: string;
  client?: string;
  location?: string;
  year?: number;
  projectType?: string;
  tools?: string[];
  githubUrl?: string;
  youtubeVideoId?: string;
  progressPdfUrl?: string;
  featured?: boolean;
};

export type PublicationStatus = "accepted" | "published" | "in-progress";

export type Publication = {
  _id: string;
  title: string;
  authors?: string;
  venue?: string;
  year?: number;
  status: PublicationStatus;
  url?: string;
  abstract?: string;
  order?: number;
};

export type Testimonial = {
  _id: string;
  quote: string;
  name: string;
  role?: string;
  order?: number;
};

export type ToolkitItem = {
  name: string;
  icon?: ResolvedImage;
};

export type GalleryItem =
  | { _key?: string; _type: "imageItem"; image: ResolvedImage; caption?: string }
  | { _key?: string; _type: "youtubeItem"; youtubeUrl: string; caption?: string };

export type GalleryGroup = {
  _id: string;
  name: string;
  order?: number;
  items?: GalleryItem[];
};
