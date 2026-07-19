"use client";

import React, { useEffect, useRef, useState, forwardRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ServiceId } from "@/context/ServiceModalContext";
import { useSwipe } from "@/app/hooks/useSwipe";
import CtaRing from "./CtaRing";

gsap.registerPlugin(ScrollTrigger);

type ServicesProps = {
  whatIDoLabel?: string;
  whatIDoHeading?: string;
  whatIDoAccentWord?: string;
  card1Title?: string;
  card1Subtitle?: string | null;
  card1Description?: string;
  card2Title?: string;
  card2Subtitle?: string | null;
  card2Description?: string;
  card3Title?: string;
  card3Subtitle?: string | null;
  card3Description?: string;
  anthraciteStructuralUrl?: string;
  anthracite3dUrl?: string;
};

function MLIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="8" cy="10" r="2.5" stroke="#0F2C5C" strokeWidth="1.5" />
      <circle cx="8" cy="18" r="2.5" stroke="#0F2C5C" strokeWidth="1.5" />
      <circle cx="8" cy="26" r="2.5" stroke="#0F2C5C" strokeWidth="1.5" />
      <circle cx="18" cy="14" r="2.5" stroke="#0F2C5C" strokeWidth="1.5" />
      <circle cx="18" cy="22" r="2.5" stroke="#0F2C5C" strokeWidth="1.5" />
      <circle cx="28" cy="18" r="2.5" stroke="#0F2C5C" strokeWidth="1.5" />
      <path d="M10.5 10L15.5 14M10.5 18L15.5 14M10.5 18L15.5 22M10.5 26L15.5 22M20.5 14L25.5 18M20.5 22L25.5 18" stroke="#0F2C5C" strokeWidth="1.2" strokeOpacity="0.6" />
    </svg>
  );
}

function StructuralIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <rect x="4" y="20" width="28" height="12" rx="1" stroke="#0F2C5C" strokeWidth="1.5" />
      <rect x="10" y="12" width="16" height="8" stroke="#0F2C5C" strokeWidth="1.5" />
      <path d="M18 4L28 12H8L18 4Z" stroke="#0F2C5C" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="15" y="24" width="6" height="8" stroke="#0F2C5C" strokeWidth="1.5" />
    </svg>
  );
}

function ThreeDIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path d="M18 4L32 12V24L18 32L4 24V12L18 4Z" stroke="#0F2C5C" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M18 4V20M18 20L4 12M18 20L32 12" stroke="#0F2C5C" strokeWidth="1.5" strokeOpacity="0.6" />
    </svg>
  );
}

const DEFAULT_STRUCTURAL_URL = "https://anthracite-website.vercel.app/work/architectural-structural";
const DEFAULT_3D_URL = "https://anthracite-website.vercel.app/work/sculptor";

export default function Services({
  whatIDoLabel = "What I Do",
  whatIDoHeading = "Three disciplines, one workflow",
  whatIDoAccentWord = "workflow",
  card1Title = "ML, Robotics & Research",
  card1Subtitle = null,
  card1Description = "Developing custom computer vision models (U-Net, YOLOv8) for SHM and site safety, and building Physics-Informed Neural Networks (PINNs) for predictive analysis.",
  card2Title = "Structural Engineering",
  card2Subtitle = null,
  card2Description = "Applying modern computational tools to traditional structural analysis, including physics-based numerical modeling in ABAQUS and advanced BIM workflows in Autodesk Revit.",
  card3Title = "3D Design",
  card3Subtitle = null,
  card3Description = "Creating high-fidelity 3D assets and immersive digital environments using Blender, ZBrush, and Unreal Engine for synthetic data generation and virtual reality experiences.",
  anthraciteStructuralUrl,
  anthracite3dUrl,
}: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const h2LineRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [prefersReducedMotion] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  const services = [
    {
      id: "ml-research" as ServiceId,
      Icon: MLIcon,
      title: card1Title,
      subtitle: card1Subtitle ?? null,
      description: card1Description,
      href: "/work/ml-research",
      isExternal: false,
    },
    {
      id: "structural-engineering" as ServiceId,
      Icon: StructuralIcon,
      title: card2Title,
      subtitle: card2Subtitle ?? null,
      description: card2Description,
      href: anthraciteStructuralUrl ?? DEFAULT_STRUCTURAL_URL,
      isExternal: true,
    },
    {
      id: "3d-design" as ServiceId,
      Icon: ThreeDIcon,
      title: card3Title,
      subtitle: card3Subtitle ?? null,
      description: card3Description,
      href: anthracite3dUrl ?? DEFAULT_3D_URL,
      isExternal: true,
    },
  ];

  const goToNext = () => {
    setDirection("next");
    setCurrentIndex((i) => (i + 1) % services.length);
  };
  const goToPrev = () => {
    setDirection("prev");
    setCurrentIndex((i) => (i - 1 + services.length) % services.length);
  };

  const { onTouchStart, onTouchEnd } = useSwipe(goToNext, goToPrev);

  const goldIdx = whatIDoHeading.indexOf(whatIDoAccentWord);

  useEffect(() => {
    if (!h2LineRef.current) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from(h2LineRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: h2LineRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      gsap.fromTo(
        cardRefs.current.filter(Boolean),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      // EXPLORE PROJECTS buttons: gradient ring draws around each,
      // led by a glowing head, then fades
      const rings = sectionRef.current?.querySelectorAll<SVGRectElement>(".cta-ring");
      const heads = sectionRef.current?.querySelectorAll<SVGRectElement>(".cta-ring-head");
      if (rings?.length && heads?.length) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
            toggleActions: "restart none restart none",
          },
        });
        tl.fromTo(
          rings,
          { strokeDashoffset: 1, opacity: 1 },
          { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.2 }
        )
          .fromTo(
            heads,
            { strokeDashoffset: 1, opacity: 1 },
            { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut", stagger: 0.2 },
            0
          )
          .to(
            [...Array.from(rings), ...Array.from(heads)],
            { opacity: 0, duration: 0.6, ease: "power2.out" },
            "-=0.15"
          );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headingNode =
    goldIdx !== -1 ? (
      <>
        {whatIDoHeading.slice(0, goldIdx)}
        <span className="text-gold">{whatIDoAccentWord}</span>
        {whatIDoHeading.slice(goldIdx + whatIDoAccentWord.length)}
      </>
    ) : (
      whatIDoHeading
    );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative bg-white text-dark-text py-20 lg:py-28 px-6 md:px-8 lg:px-16 overflow-hidden"
    >
      <div className="section-number" data-number="02" aria-hidden="true" />

      <div className="max-w-[1280px] mx-auto">
        <div className="mb-10 md:mb-12">
          <p className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4">
            {whatIDoLabel}
          </p>
          <div className="overflow-hidden">
            <h2
              ref={h2LineRef}
              data-gsap="true"
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-dark-text max-w-2xl"
            >
              {headingNode}
            </h2>
          </div>
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <div className="relative">
            <div className="grid">
              {services.map((service, i) => (
                <div
                  key={service.id}
                  className={`col-start-1 row-start-1 ${
                    i === currentIndex
                      ? `pointer-events-auto ${
                          prefersReducedMotion
                            ? ""
                            : direction === "next"
                            ? "slide-enter-left"
                            : "slide-enter-right"
                        }`
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <ServiceCard
                    service={service}
                    href={service.href}
                    isExternal={service.isExternal}
                    ref={(el) => {
                      cardRefs.current[i] = el;
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Side arrows */}
            <button
              onClick={goToPrev}
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 border border-gold/40 bg-surface/70 backdrop-blur-sm text-gold hover:bg-gold hover:text-surface transition-colors flex items-center justify-center"
              aria-label="Previous service"
            >
              ←
            </button>
            <button
              onClick={goToNext}
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 border border-gold/40 bg-surface/70 backdrop-blur-sm text-gold hover:bg-gold hover:text-surface transition-colors flex items-center justify-center"
              aria-label="Next service"
            >
              →
            </button>
          </div>

          {/* Pagination dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {services.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex ? "bg-gold" : "bg-gold/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              href={service.href}
              isExternal={service.isExternal}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type ServiceItem = {
  id: ServiceId;
  Icon: () => React.ReactElement;
  title: string;
  subtitle: string | null;
  description: string;
  href: string;
  isExternal: boolean;
};

const ServiceCard = forwardRef<
  HTMLDivElement,
  { service: ServiceItem; href: string; isExternal?: boolean }
>(({ service, href, isExternal }, ref) => {
  const { Icon, title, subtitle, description } = service;

  return (
    <div
      ref={ref}
      data-gsap="true"
      className="
        h-full group relative flex flex-col gap-6 p-8 md:p-10
        border border-dark-text/10 bg-cream
        transition-all duration-500 ease-out
        hover:border-gold hover:bg-white
        before:absolute before:inset-0
        before:border before:border-gold before:opacity-0
        before:scale-[0.97] before:transition-all before:duration-500
        hover:before:opacity-100 hover:before:scale-100
        before:pointer-events-none
      "
    >
      <div className="transition-transform duration-300 group-hover:scale-110 w-fit">
        <Icon />
      </div>

      <div>
        <h3 className="text-xl md:text-2xl font-bold text-dark-text leading-snug mb-1">
          {title}
        </h3>
        {subtitle && (
          <p className="text-gold text-xs tracking-widest uppercase">
            {subtitle}
          </p>
        )}
      </div>

      <p className="text-dark-text/60 text-sm leading-relaxed flex-1">
        {description}
      </p>

      {isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="
            relative mt-2 flex items-center justify-center gap-3
            border-2 border-gold bg-gold/5
            hover:bg-gold hover:text-white
            text-gold font-semibold
            px-6 py-4 text-sm tracking-[0.2em] uppercase
            transition-colors duration-300
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
          "
          aria-label={`Explore ${title}`}
        >
          <CtaRing />
          EXPLORE PROJECTS
        </a>
      ) : (
        <Link
          href={href}
          className="
            relative mt-2 flex items-center justify-center gap-3
            border-2 border-gold bg-gold/5
            hover:bg-gold hover:text-white
            text-gold font-semibold
            px-6 py-4 text-sm tracking-[0.2em] uppercase
            transition-colors duration-300
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold
          "
          aria-label={`Explore ${title}`}
        >
          <CtaRing />
          EXPLORE PROJECTS
        </Link>
      )}

      <div
        className="h-px bg-gold scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100"
        aria-hidden
      />
    </div>
  );
});
ServiceCard.displayName = "ServiceCard";
