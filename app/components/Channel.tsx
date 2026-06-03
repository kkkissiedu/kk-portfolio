"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  channelLabel?: string;
  channelHeading?: string;
  channelAccentWord?: string;
  channelIntro?: string;
  videoUrl?: string;
  channelUrl?: string;
  ctaLabel?: string;
};

function getEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const yt = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([^&?\s#/]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?playsinline=1&rel=0`;
  return null;
}

export default function Channel({
  channelLabel = "From the Channel",
  channelHeading = "Tutorials, project showcases, and AI insights",
  channelAccentWord = "insights",
  channelIntro = "Tutorials, project showcases, and insights into the world of engineering and AI.",
  videoUrl = "https://www.youtube.com/watch?v=GREgRXG-fbo",
  channelUrl = "http://www.youtube.com/@kkkissiedu",
  ctaLabel = "Visit My Channel",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const embed = getEmbedUrl(videoUrl);

  const goldIdx = channelHeading.indexOf(channelAccentWord);
  const headingNode = goldIdx !== -1 ? (
    <>{channelHeading.slice(0, goldIdx)}<span className="text-gold">{channelAccentWord}</span>{channelHeading.slice(goldIdx + channelAccentWord.length)}</>
  ) : channelHeading;

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      if (h2Ref.current)
        gsap.from(h2Ref.current, { opacity: 0, y: 40, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: h2Ref.current, start: "top 85%" } });
      if (embedRef.current)
        gsap.from(embedRef.current, { opacity: 0, y: 40, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: embedRef.current, start: "top 85%" } });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="youtube"
      className="relative bg-white text-dark-text py-20 lg:py-28 px-6 md:px-8 lg:px-16 overflow-hidden">
      <div className="section-number" data-number="08" aria-hidden="true" />
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-10 md:mb-12 text-center">
          <p className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4">{channelLabel}</p>
          <h2 ref={h2Ref} className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-dark-text">
            {headingNode}
          </h2>
          {channelIntro && (
            <p className="text-dark-text/65 text-base mt-4 max-w-2xl mx-auto leading-relaxed">{channelIntro}</p>
          )}
        </div>

        <div ref={embedRef} className="relative aspect-video w-full bg-anthracite mb-8 border border-dark-text/10 overflow-hidden">
          {embed ? (
            <iframe src={embed} className="absolute inset-0 w-full h-full" title="Featured YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-cream/40 text-sm">
              No video URL configured
            </div>
          )}
        </div>

        <div className="text-center">
          <a href={channelUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-gold text-white hover:bg-gold-highlight px-8 py-4 text-sm tracking-widest uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
