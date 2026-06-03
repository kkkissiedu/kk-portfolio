"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AboutProps = {
  aboutLabel?: string;
  aboutHeading?: string;
  aboutHeadingAccentWords?: string;
  aboutBodyPara1?: string;
  aboutBodyPara2?: string;
  aboutPhotoUrl?: string;
  anthraciteUrl?: string;
  academicCvUrl?: string;
  professionalCvUrl?: string;
  statOneValue?: string;
  statOneLabel?: string;
  statTwoValue?: string;
  statTwoLabel?: string;
  statThreeValue?: string;
  statThreeLabel?: string;
};

function parseStatValue(raw: string): { value: number; suffix: string } {
  const match = raw.match(/^(\d+)(.*)$/);
  return match
    ? { value: parseInt(match[1], 10), suffix: match[2] }
    : { value: 0, suffix: "" };
}

export default function About({
  aboutLabel = "About",
  aboutHeading = "Research-focused Engineer building intelligent infrastructure",
  aboutHeadingAccentWords = "intelligent",
  aboutBodyPara1 = "I am a research-focused Civil Engineer passionate about applying cutting-edge AI to solve real-world infrastructure challenges in Ghana. My work integrates Physics-Informed AI, computational mechanics, and design automation into a complete workflow: I create 3D digital worlds, use them to generate synthetic data, and then train the physics-informed models needed for analysis.",
  aboutBodyPara2 = "This passion led me to co-found The Anthracite Ltd., a startup with the mission to develop Ghana's first 3D-printed Green Building estate. My ultimate goal is to pioneer a new paradigm where structures are built with and managed by intelligent digital twins throughout their entire lifespan.",
  aboutPhotoUrl,
  anthraciteUrl = "https://theanthracite.com",
  academicCvUrl,
  professionalCvUrl,
  statOneValue = "20+",
  statOneLabel = "Projects shipped",
  statTwoValue = "3",
  statTwoLabel = "Disciplines",
  statThreeValue = "1st",
  statThreeLabel = "Class Honours, KNUST",
}: AboutProps) {
  const stats = [
    { ...parseStatValue(statOneValue), label: statOneLabel },
    { ...parseStatValue(statTwoValue), label: statTwoLabel },
    { ...parseStatValue(statThreeValue), label: statThreeLabel },
  ];

  const goldWord = aboutHeadingAccentWords;
  const goldIdx = aboutHeading.indexOf(goldWord);
  let line1Before = aboutHeading;
  let line1Gold = "";
  let line2 = "";
  if (goldIdx !== -1) {
    line1Before = aboutHeading.slice(0, goldIdx);
    line1Gold = goldWord;
    line2 = aboutHeading.slice(goldIdx + goldWord.length).trim();
  }

  const sectionRef = useRef<HTMLElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const statsRowRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const h2Line1Ref = useRef<HTMLDivElement>(null);
  const h2Line2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!h2Line1Ref.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from(
        [h2Line1Ref.current, h2Line2Ref.current].filter(Boolean),
        {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: h2Line1Ref.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.from(rightRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rightRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: dividerRef.current,
            start: "top 88%",
          },
        }
      );

      gsap.fromTo(
        statsRowRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRowRef.current,
            start: "top 88%",
          },
        }
      );

      stats.forEach((stat, i) => {
        const el = counterRefs.current[i];
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: statsRowRef.current,
            start: "top 85%",
          },
          onUpdate() {
            el.textContent = Math.round(obj.val) + stat.suffix;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-cream text-dark-text py-20 lg:py-28 px-6 md:px-8 lg:px-16 overflow-hidden"
    >
      {/* Decorative section number */}
      <div className="section-number" data-number="01" aria-hidden="true" />

      <div className="max-w-[1280px] mx-auto">
        {/* Three-column layout: photo | heading+bio | (mobile stacked) */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] lg:grid-cols-[320px_1fr] gap-12 md:gap-16 items-start mb-12">

          {/* Left — portrait photo */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-64 h-80 md:w-full md:h-auto md:aspect-[3/4] bg-cream border border-dark-text/10 overflow-hidden">
              {aboutPhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={aboutPhotoUrl}
                  alt="Kwabena Kwayisi Kissiedu"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-cream">
                  <span className="font-heading text-6xl font-bold text-gold/20">KK</span>
                </div>
              )}
            </div>
          </div>

          {/* Right — heading + bio + actions */}
          <div>
            <p className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4">
              {aboutLabel}
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight text-dark-text mb-6">
              <div className="overflow-hidden">
                <div ref={h2Line1Ref} data-gsap="true">
                  {line1Before}
                  {line1Gold && <span className="text-gold-heading">{line1Gold}</span>}
                </div>
              </div>
              {line2 && (
                <div className="overflow-hidden">
                  <div ref={h2Line2Ref} data-gsap="true">
                    {line2}
                  </div>
                </div>
              )}
            </h2>

            <div ref={rightRef} data-gsap="true" className="space-y-4 mb-8">
              <p className="text-dark-text/75 text-base leading-relaxed">{aboutBodyPara1}</p>
              <p className="text-dark-text/75 text-base leading-relaxed">{aboutBodyPara2}</p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3">
              {academicCvUrl && (
                <a href={academicCvUrl} download
                  className="inline-flex items-center gap-2 border border-gold text-gold hover:bg-gold hover:text-white px-5 py-3 text-xs tracking-widest uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Academic CV
                </a>
              )}
              {professionalCvUrl && (
                <a href={professionalCvUrl} download
                  className="inline-flex items-center gap-2 border border-gold text-gold hover:bg-gold hover:text-white px-5 py-3 text-xs tracking-widest uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Professional CV
                </a>
              )}
              {anthraciteUrl && (
                <a href={anthraciteUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gold text-white hover:bg-gold-highlight px-5 py-3 text-xs tracking-widest uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold">
                  The Anthracite →
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Gold horizontal divider */}
        <div
          ref={dividerRef}
          data-gsap="true"
          className="h-px gold-gradient-line mb-12 origin-left"
          aria-hidden
        />

        {/* Counters */}
        <div
          ref={statsRowRef}
          data-gsap="true"
          className="grid grid-cols-3 gap-6 md:gap-12"
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-gold-heading leading-none font-heading">
                <span
                  ref={(el) => {
                    counterRefs.current[i] = el;
                  }}
                >
                  0{stat.suffix}
                </span>
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-dark-text/55">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
