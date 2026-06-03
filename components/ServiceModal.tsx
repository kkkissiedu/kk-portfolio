"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useServiceModal, type ServiceId } from "@/context/ServiceModalContext";

type ServiceModalProps = {
  card1Title?: string;
  card1Subtitle?: string | null;
  card1Description?: string;
  card2Title?: string;
  card2Subtitle?: string | null;
  card2Description?: string;
  card3Title?: string;
  card3Subtitle?: string | null;
  card3Description?: string;
};

type ServiceData = {
  heading: string;
  subtitle: string | null;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

export default function ServiceModal({
  card1Title = "ML, Robotics & Research",
  card1Subtitle = null,
  card1Description = "Developing custom computer vision models (U-Net, YOLOv8) for SHM and site safety, and building Physics-Informed Neural Networks (PINNs) for predictive analysis.",
  card2Title = "Structural Engineering",
  card2Subtitle = null,
  card2Description = "Applying modern computational tools to traditional structural analysis, including physics-based numerical modeling in ABAQUS and advanced BIM workflows in Autodesk Revit.",
  card3Title = "3D Design",
  card3Subtitle = null,
  card3Description = "Creating high-fidelity 3D assets and immersive digital environments using Blender, ZBrush, and Unreal Engine for synthetic data generation and virtual reality experiences.",
}: ServiceModalProps) {
  const SERVICE_CONTENT: Record<ServiceId, ServiceData> = {
    "ml-research": {
      heading: card1Title,
      subtitle: card1Subtitle,
      description: card1Description,
      ctaLabel: "Explore ML, Robotics & Research →",
      ctaHref: "/work/ml-research",
    },
    "structural-engineering": {
      heading: card2Title,
      subtitle: card2Subtitle,
      description: card2Description,
      ctaLabel: "Explore Structural Engineering →",
      ctaHref: "/work/structural-engineering",
    },
    "3d-design": {
      heading: card3Title,
      subtitle: card3Subtitle,
      description: card3Description,
      ctaLabel: "Explore 3D Design →",
      ctaHref: "/work/3d-design",
    },
  };

  const { activeServiceId, closeServiceModal } = useServiceModal();
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const animateOpen = useCallback(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    ).fromTo(
      panelRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" },
      "-=0.15"
    );
  }, []);

  const animateClose = useCallback(
    (onComplete: () => void) => {
      const tl = gsap.timeline({ onComplete });
      tl.to(panelRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      }).to(
        backdropRef.current,
        { opacity: 0, duration: 0.25, ease: "power2.in" },
        "-=0.15"
      );
    },
    []
  );

  const handleClose = useCallback(() => {
    animateClose(closeServiceModal);
  }, [animateClose, closeServiceModal]);

  useEffect(() => {
    if (!activeServiceId) return;
    document.body.style.overflow = "hidden";
    animateOpen();
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeServiceId, animateOpen]);

  useEffect(() => {
    if (!activeServiceId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeServiceId, handleClose]);

  if (!activeServiceId) return null;

  const content = SERVICE_CONTENT[activeServiceId];

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 sm:p-6"
      style={{ opacity: 0 }}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={content.heading}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-none" />

      <div
        ref={panelRef}
        className="relative w-full max-w-2xl bg-white border border-dark-text/10 shadow-2xl p-8 md:p-10 max-h-[90vh] overflow-y-auto"
        style={{ opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-dark-text/40 hover:text-gold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm p-1"
          aria-label="Close"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2 className="text-2xl sm:text-3xl font-bold text-dark-text mb-2 leading-tight pr-8">
          {content.heading}
        </h2>
        {content.subtitle && (
          <p className="text-gold text-xs tracking-widest uppercase mb-6">
            {content.subtitle}
          </p>
        )}

        <div className="h-px w-12 bg-gold mb-6" />

        <p className="text-dark-text/70 text-sm leading-relaxed mb-8">
          {content.description}
        </p>

        <Link
          href={content.ctaHref}
          onClick={handleClose}
          className="inline-block border border-gold text-gold px-6 py-3 text-xs tracking-widest uppercase transition-all duration-300 hover:bg-gold hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm"
        >
          {content.ctaLabel}
        </Link>
      </div>
    </div>
  );
}
