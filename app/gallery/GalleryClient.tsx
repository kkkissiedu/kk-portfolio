"use client";

import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import type { GalleryGroup, GalleryItem } from "@/types/sanity";

function getYouTubeEmbed(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([^&?\s#/]+)/);
  return yt ? `https://www.youtube.com/embed/${yt[1]}?playsinline=1&rel=0` : null;
}

function GalleryMedia({ item }: { item: GalleryItem }) {
  if (item._type === "imageItem" && item.image?.asset?.url) {
    return (
      <figure className="relative w-full bg-cream border border-dark-text/10">
        <div className="relative w-full aspect-[4/3]">
          <Image src={item.image.asset.url} alt={item.caption || "Gallery image"} fill
            className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
        </div>
        {item.caption && <figcaption className="px-3 py-2 text-xs text-dark-text/65 tracking-wide">{item.caption}</figcaption>}
      </figure>
    );
  }
  if (item._type === "youtubeItem" && item.youtubeUrl) {
    const embed = getYouTubeEmbed(item.youtubeUrl);
    if (!embed) return null;
    return (
      <figure className="relative w-full bg-anthracite border border-dark-text/10">
        <div className="relative w-full aspect-video">
          <iframe src={embed} className="absolute inset-0 w-full h-full"
            title={item.caption || "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        </div>
        {item.caption && <figcaption className="px-3 py-2 text-xs text-dark-text/65 tracking-wide">{item.caption}</figcaption>}
      </figure>
    );
  }
  return null;
}

export default function GalleryClient({ groups }: { groups: GalleryGroup[] }) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-cream text-dark-text">
        <section className="pt-28 pb-10 md:pt-36 md:pb-16 px-6 md:px-8 lg:px-16">
          <div className="max-w-[1280px] mx-auto">
            <p className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4">Gallery</p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-none tracking-tight text-dark-text text-balance">
              A visual journal
            </h1>
            <div className="mt-8 h-px w-24 bg-gold/50" />
          </div>
        </section>

        {groups.length === 0 ? (
          <section className="px-6 md:px-8 lg:px-16 pb-32">
            <div className="max-w-[1280px] mx-auto flex items-center justify-center py-24">
              <div className="border border-gold px-12 py-8 text-center">
                <p className="text-gold text-sm tracking-[0.2em] uppercase">Gallery content coming soon</p>
              </div>
            </div>
          </section>
        ) : (
          groups.map((group, gi) => (
            <section key={group._id} className={`px-6 md:px-8 lg:px-16 py-14 md:py-20 ${gi % 2 === 0 ? "bg-cream" : "bg-white"}`}>
              <div className="max-w-[1280px] mx-auto">
                <h2 className="font-heading text-2xl md:text-4xl font-bold text-dark-text mb-2">{group.name}</h2>
                <div className="h-px w-16 bg-gold mb-8" />
                {group.items && group.items.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.items.map((item, i) => (
                      <GalleryMedia key={item._key ?? i} item={item} />
                    ))}
                  </div>
                ) : (
                  <p className="text-dark-text/40 text-sm italic">No items in this group yet.</p>
                )}
              </div>
            </section>
          ))
        )}
      </main>
      <Footer />
    </>
  );
}
