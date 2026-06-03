"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type FeaturedProject, type Publication } from "@/lib/sanity";
import { useProjectModal, type SanityProject } from "@/context/ProjectModalContext";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import MediaCard from "@/app/components/MediaCard";
import Publications from "@/app/components/Publications";
import { useSwipe } from "@/app/hooks/useSwipe";

gsap.registerPlugin(ScrollTrigger);

type DisciplineClientProps = {
  overline: string;
  defaultHeading: string;
  defaultSubtitle: string;
  heroHeading?: string;
  heroSubtitle?: string;
  projects: FeaturedProject[];
  publications?: Publication[];
};

export default function DisciplineClient({
  overline,
  defaultHeading,
  defaultSubtitle,
  heroHeading,
  heroSubtitle,
  projects: initialProjects,
  publications,
}: DisciplineClientProps) {
  const [projects] = useState<FeaturedProject[]>(initialProjects);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prefersReducedMotion] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const { openModal } = useProjectModal();
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const els = heroRef.current!.querySelectorAll<HTMLElement>("[data-hero]");
      gsap.fromTo(
        Array.from(els),
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.14,
          delay: 0.15,
        }
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!gridRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      const cards = gridRef.current!.querySelectorAll<HTMLElement>(".proj-card");
      if (!cards.length) return;
      gsap.fromTo(
        Array.from(cards),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: gridRef.current!,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, gridRef);
    return () => ctx.revert();
  }, [projects.length]);

  const handleOpen = useCallback(
    (p: FeaturedProject) => openModal(p as unknown as SanityProject),
    [openModal]
  );

  const goToIndex = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 700);
  };
  const goToNext = () => goToIndex((currentIndex + 1) % projects.length);
  const goToPrev = () =>
    goToIndex((currentIndex - 1 + projects.length) % projects.length);
  const { onTouchStart, onTouchEnd } = useSwipe(goToNext, goToPrev);

  return (
    <>
      <Navbar />

      <main id="main-content">
        <section className="bg-cream text-dark-text pt-28 pb-10 md:pt-36 md:pb-20 px-6 md:px-8 lg:px-16">
          <div ref={heroRef} className="max-w-[1280px] mx-auto">
            <p data-hero className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4">
              {overline}
            </p>
            <h1 data-hero className="text-4xl md:text-6xl lg:text-7xl font-bold leading-none tracking-tight text-dark-text text-balance">
              {heroHeading ?? defaultHeading}
            </h1>
            <p data-hero className="mt-4 md:mt-8 text-sm md:text-base text-dark-text/60 max-w-2xl leading-relaxed">
              {heroSubtitle ?? defaultSubtitle}
            </p>
            <div data-hero className="my-6 md:mt-12 h-px w-24 bg-gold/50" />
          </div>
        </section>

        <section className="bg-white pb-20 md:pb-28 pt-10 px-6 md:px-8 lg:px-16">
          <div className="max-w-[1280px] mx-auto">
            <div className="md:hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              {projects.length === 0 ? (
                <div className="flex items-center justify-center py-24">
                  <div className="border border-gold px-12 py-8 text-center">
                    <p className="text-gold text-sm tracking-[0.2em] uppercase">Projects coming soon</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid">
                    {projects.map((project, i) => {
                      const imgSrc = project.mainImage?.asset?.url ?? null;
                      return (
                        <div
                          key={project._id}
                          className={`col-start-1 row-start-1 ${
                            i === currentIndex
                              ? `pointer-events-auto ${prefersReducedMotion ? "" : "slide-enter"}`
                              : "opacity-0 pointer-events-none"
                          }`}
                        >
                          <MediaCard
                            image={imgSrc}
                            title={project.title}
                            subcategory={project.subcategory}
                            metadata={[project.client, project.location, project.year]}
                            onClick={() => handleOpen(project)}
                            aspectRatio="4/3"
                            cardClassName="proj-card w-full"
                          />
                        </div>
                      );
                    })}
                  </div>
                  {projects.length > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-6">
                      <button
                        onClick={goToPrev}
                        className="w-10 h-10 border border-gold/40 text-gold hover:bg-gold hover:text-white transition-colors flex items-center justify-center"
                        aria-label="Previous project"
                      >
                        ←
                      </button>
                      <div className="flex gap-2">
                        {projects.map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? "bg-gold" : "bg-gold/30"}`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={goToNext}
                        className="w-10 h-10 border border-gold/40 text-gold hover:bg-gold hover:text-white transition-colors flex items-center justify-center"
                        aria-label="Next project"
                      >
                        →
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="hidden md:block">
              {projects.length === 0 ? (
                <div className="flex items-center justify-center py-24">
                  <div className="border border-gold px-12 py-8 text-center">
                    <p className="text-gold text-sm tracking-[0.2em] uppercase">Projects coming soon</p>
                  </div>
                </div>
              ) : (
                <div
                  ref={gridRef}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]"
                >
                  {projects.map((project) => {
                    const imgSrc = project.mainImage?.asset?.url ?? null;
                    return (
                      <MediaCard
                        key={project._id}
                        image={imgSrc}
                        title={project.title}
                        subcategory={project.subcategory}
                        metadata={[project.client, project.location, project.year]}
                        onClick={() => handleOpen(project)}
                        aspectRatio="4/3"
                        cardClassName="proj-card"
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {publications && publications.length > 0 && (
          <Publications publications={publications} compact />
        )}
      </main>
      <Footer />
    </>
  );
}
