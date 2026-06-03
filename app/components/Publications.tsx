"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Publication, PublicationStatus } from "@/types/sanity";

gsap.registerPlugin(ScrollTrigger);

const STATUS_LABEL: Record<PublicationStatus, string> = {
  accepted: "Accepted",
  published: "Published",
  "in-progress": "In Progress",
};

const STATUS_STYLES: Record<PublicationStatus, string> = {
  accepted: "bg-gold/10 text-gold border-gold/40",
  published: "bg-gold text-white border-transparent",
  "in-progress": "bg-cream text-dark-text/60 border-dark-text/20",
};

type Props = {
  publications: Publication[];
  compact?: boolean;
  sectionNumber?: string;
};

export default function Publications({
  publications,
  compact = false,
  sectionNumber = "06",
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      if (h2Ref.current) {
        gsap.from(h2Ref.current, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: h2Ref.current, start: "top 85%", toggleActions: "play none none none" },
        });
      }
      const rows = sectionRef.current!.querySelectorAll<HTMLElement>(".pub-row");
      if (rows.length) {
        gsap.fromTo(Array.from(rows), { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  if (!publications || publications.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="publications"
      className={`relative text-dark-text px-6 md:px-8 lg:px-16 overflow-hidden ${
        compact ? "bg-cream py-16 lg:py-20" : "bg-cream py-20 lg:py-28"
      }`}
    >
      <div className="section-number" data-number={sectionNumber} aria-hidden="true" />
      <div className="max-w-[1100px] mx-auto">
        <div className={compact ? "mb-8" : "mb-10 md:mb-12"}>
          <p className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4">
            Publications
          </p>
          <h2
            ref={h2Ref}
            className={`font-bold leading-tight tracking-tight text-dark-text ${
              compact ? "text-2xl md:text-3xl" : "text-4xl sm:text-5xl md:text-6xl"
            }`}
          >
            Research <span className="text-gold">Output</span>
          </h2>
        </div>

        <ul className="border-t border-dark-text/15">
          {publications.map((pub) => {
            const status = (pub.status ?? "in-progress") as PublicationStatus;
            return (
              <li key={pub._id} className="pub-row group border-b border-dark-text/15 py-6 md:py-7 flex flex-col md:flex-row md:items-start gap-3 md:gap-8">
                <div className="md:w-32 shrink-0 flex md:flex-col gap-2 md:gap-1 items-start">
                  <span className={`text-[10px] tracking-[0.2em] uppercase px-2 py-1 border ${STATUS_STYLES[status]}`}>
                    {STATUS_LABEL[status]}
                  </span>
                  {pub.year && (
                    <span className="text-xs text-dark-text/55 tracking-widest">{pub.year}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {pub.url ? (
                    <a href={pub.url} target="_blank" rel="noopener noreferrer"
                      className="font-heading text-xl md:text-2xl font-bold text-dark-text leading-snug group-hover:text-gold transition-colors">
                      {pub.title}
                    </a>
                  ) : (
                    <p className="font-heading text-xl md:text-2xl font-bold text-dark-text leading-snug">{pub.title}</p>
                  )}
                  {pub.authors && <p className="text-sm text-dark-text/65 mt-1">{pub.authors}</p>}
                  {pub.venue && <p className="text-xs tracking-widest uppercase text-dark-text/50 mt-2">{pub.venue}</p>}
                  {pub.abstract && !compact && (
                    <p className="text-sm text-dark-text/60 mt-3 leading-relaxed line-clamp-3">{pub.abstract}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
