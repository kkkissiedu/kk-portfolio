"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Testimonial } from "@/types/sanity";

gsap.registerPlugin(ScrollTrigger);

const DEFAULTS: Testimonial[] = [
  {
    _id: "default-1",
    quote: "Kwabena's ability to merge deep engineering principles with modern AI is remarkable. His work on our project was pivotal.",
    name: "Dr. Evans Amponsah",
    role: "Research Supervisor, KNUST",
  },
  {
    _id: "default-2",
    quote: "The 3D visualizations Kwabena produced were beyond our expectations. He is professional, creative, and delivers exceptional quality.",
    name: "Selasie Awity",
    role: "CEO, Dobiison VR Ghana Ltd.",
  },
];

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const list = testimonials && testimonials.length > 0 ? testimonials : DEFAULTS;
  const sectionRef = useRef<HTMLElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      if (h2Ref.current)
        gsap.from(h2Ref.current, { opacity: 0, y: 40, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: h2Ref.current, start: "top 85%" } });
      const cards = sectionRef.current!.querySelectorAll<HTMLElement>(".testi-card");
      if (cards.length)
        gsap.fromTo(Array.from(cards), { y: 40, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="testimonials"
      className="relative bg-cream text-dark-text py-20 lg:py-28 px-6 md:px-8 lg:px-16 overflow-hidden">
      <div className="section-number" data-number="09" aria-hidden="true" />
      <div className="max-w-[1100px] mx-auto">
        <div className="mb-12 text-center">
          <p className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4">Testimonials</p>
          <h2 ref={h2Ref} className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-dark-text">
            What colleagues <span className="text-gold">say</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {list.map((t) => (
            <figure key={t._id} className="testi-card bg-white border border-dark-text/10 p-8 md:p-10 flex flex-col gap-4">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="shrink-0">
                <path d="M8 24c-2.2 0-4-1.8-4-4v-4c0-4.4 3.6-8 8-8v4c-2.2 0-4 1.8-4 4h4v8H8zm14 0c-2.2 0-4-1.8-4-4v-4c0-4.4 3.6-8 8-8v4c-2.2 0-4 1.8-4 4h4v8h-4z"
                  fill="#0F2C5C" fillOpacity="0.5" />
              </svg>
              <blockquote className="font-heading text-xl md:text-2xl italic text-dark-text/85 leading-snug flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption>
                <p className="font-semibold text-dark-text text-sm">{t.name}</p>
                {t.role && <p className="text-xs text-dark-text/55 tracking-widest uppercase mt-1">{t.role}</p>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
