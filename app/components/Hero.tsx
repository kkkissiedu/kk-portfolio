"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type HeroProps = {
  heroOverline?: string;
  heroTagline?: string;
  heroAccentWord?: string;
  heroSubtitle?: string;
  heroCtaPrimary?: string;
  heroCtaSecondary?: string;
};

export default function Hero({
  heroOverline = "Kwabena Kwayisi Kissiedu",
  heroTagline = "Engineering the Future with Data & Design",
  heroAccentWord = "Data",
  heroSubtitle = "A First Class Honors Civil Engineer developing AI-driven tools for safer, more sustainable infrastructure through a complete workflow from 3D synthetic data generation to physics-informed modeling.",
  heroCtaPrimary = "View My Work",
  heroCtaSecondary = "Get in Touch",
}: HeroProps) {
  const words = heroTagline.split(" ");
  const goldIndex = words.findIndex((w) =>
    w.replace(/[^a-zA-Z]/g, "").toLowerCase() ===
    heroAccentWord.replace(/[^a-zA-Z]/g, "").toLowerCase()
  );

  const containerRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const overlineRef = useRef<HTMLParagraphElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        overlineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 }
      );
      tl.fromTo(
        wordRefs.current.filter(Boolean),
        { opacity: 0, y: 60, skewY: 4 },
        { opacity: 1, y: 0, skewY: 0, duration: 0.9, stagger: 0.12 },
        "-=0.2"
      );

      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7 },
        "-=0.3"
      );

      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "-=0.2"
      );

      tl.fromTo(
        lineRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 1, ease: "power2.inOut" },
        "-=0.4"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center bg-anthracite overflow-hidden"
    >
      <video
        className="absolute inset-0 w-full h-full object-cover z-[0] pointer-events-none"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        poster="/hero-poster.jpg"
        aria-hidden
        style={{ filter: "brightness(0.45) saturate(0.7)" }}
      >
        <source src="/hero.webm" type="video/webm" />
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for legibility */}
      <div className="absolute inset-0 bg-black/40 z-[2]" aria-hidden />

      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(15,44,92,0.18) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 lg:px-16 text-center">
        {/* Overline */}
        <p
          ref={overlineRef}
          className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4"
          data-gsap="true"
        >
          {heroOverline}
        </p>

        {/* Heading */}
        <h1
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[1.05] tracking-tight mb-6 md:mb-8 flex flex-wrap justify-center gap-x-[0.3em] text-balance"
          aria-label={heroTagline}
        >
          {words.map((word, i) => (
            <span key={`${word}-${i}`} className="inline-block">
              <span
                ref={(el) => {
                  wordRefs.current[i] = el;
                }}
                data-gsap="true"
                className={`inline-block ${
                  i === goldIndex ? "text-gold" : "text-white"
                }`}
                style={{ willChange: "transform, opacity" }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        {/* Subheading */}
        <p
          ref={subRef}
          data-gsap="true"
          className="text-white text-base md:text-lg lg:text-xl max-w-[600px] mx-auto text-center leading-relaxed mt-6 mb-10 font-body"
        >
          {heroSubtitle}
        </p>

        {/* CTAs */}
        <div
          ref={ctaRef}
          data-gsap="true"
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <a
            href="#projects"
            className="relative inline-flex items-center justify-center px-8 py-4 text-sm tracking-widest uppercase font-body font-medium bg-gold text-white hover:bg-gold-highlight transition-colors duration-300 min-w-[180px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-anthracite"
          >
            {heroCtaPrimary}
          </a>
          <a
            href="#contact"
            className="relative inline-flex items-center justify-center px-8 py-4 text-sm tracking-widest uppercase font-body font-medium border border-gold text-gold hover:bg-gold hover:text-white transition-colors duration-300 min-w-[180px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-anthracite"
          >
            {heroCtaSecondary}
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <span
          className="text-cream text-xs tracking-widest uppercase font-body"
        >
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-cream to-transparent animate-pulse" />
      </div>

      {/* Looping animated gold gradient line */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10"
        aria-hidden
      >
        <div
          ref={lineRef}
          data-gsap="true"
          className="h-px w-full gold-gradient-line origin-left"
        />
      </div>
    </section>
  );
}
