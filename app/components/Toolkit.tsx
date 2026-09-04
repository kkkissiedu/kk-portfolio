"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ToolkitItemResolved } from "@/lib/sanity";

gsap.registerPlugin(ScrollTrigger);

// Logos live in public/toolkit. Most are the files the previous portfolio
// shipped; the rest are simple-icons marks (CC0, painted with each brand's
// hex) plus XGBoost's own project logo. Trademarks belong to their owners and
// are used here only to identify tools actually used.
//
// A per-item icon uploaded in Studio still wins over this map. Anything with
// no logo available (Lumion, TensorRT) renders as a name-only tile.
const TOOL_LOGOS: Record<string, string> = {
  "Autodesk Revit": "autodesk-revit.png",
  AutoCAD: "autocad.png",
  ProtaStructure: "protastructure.png",
  "Tekla Structures": "tekla-structures.png",
  ABAQUS: "abaqus.png",
  "Autodesk Fusion": "autodesk-fusion.svg",
  "Grasshopper (Rhino)": "grasshopper-rhino.png",
  Python: "python.png",
  PyTorch: "pytorch.png",
  "scikit-learn": "scikit-learn.svg",
  XGBoost: "xgboost.png",
  OpenCV: "opencv.png",
  "Ultralytics YOLO": "ultralytics-yolo.svg",
  "NVIDIA Jetson": "nvidia-jetson.svg",
  "ONNX Runtime": "onnx-runtime.svg",
  NumPy: "numpy.png",
  Optuna: "optuna.svg",
  "Weights & Biases": "weights-and-biases.svg",
  Blender: "blender.png",
  ZBrush: "zbrush.png",
  "Substance Painter": "substance-painter.png",
  "Marmoset Toolbag": "marmoset-toolbag.png",
  "Unreal Engine": "unreal-engine.png",
  Unity: "unity.png",
  "Adobe Photoshop": "adobe-photoshop.png",
  "Adobe Illustrator": "adobe-illustrator.png",
};

function logoFor(item: ToolkitItemResolved): string | null {
  if (item.icon?.asset?.url) return item.icon.asset.url;
  const file = TOOL_LOGOS[item.name];
  return file ? `/toolkit/${file}` : null;
}

type Props = {
  toolkitLabel?: string;
  toolkitHeading?: string;
  toolkitAccentWord?: string;
  toolkitIntro?: string;
  column1Title?: string;
  column1Items?: ToolkitItemResolved[];
  column2Title?: string;
  column2Items?: ToolkitItemResolved[];
  column3Title?: string;
  column3Items?: ToolkitItemResolved[];
};

function ToolColumn({ title, items }: { title: string; items: ToolkitItemResolved[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h3 className="font-heading text-xl md:text-2xl font-bold text-gold mb-6 text-center">{title}</h3>
      <ul className="grid grid-cols-2 gap-3">
        {items.map((item, i) => {
          const logo = logoFor(item);
          return (
            <li key={`${item.name}-${i}`}
              className="toolkit-item flex flex-col items-center justify-center gap-2 p-4 min-h-[104px] bg-white border border-dark-text/10 hover:border-gold transition-colors duration-200">
              {/* No initials placeholder for the few tools with no logo: too
                  many of these names share their first two letters (Autodesk
                  Revit and AutoCAD both gave AU), so the badge read as a bug. */}
              {logo && (
                <div className="relative w-10 h-10 shrink-0">
                  {/* Plain img: these are local, already-sized assets, and one
                      is an SVG, which next/image will not optimise without
                      dangerouslyAllowSVG. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logo} alt="" aria-hidden="true"
                    className="w-full h-full object-contain" loading="lazy" />
                </div>
              )}
              <p className="text-xs text-dark-text/80 text-center leading-tight">{item.name}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Toolkit({
  toolkitLabel = "My Toolkit",
  toolkitHeading = "Tools I bring ideas to life with",
  toolkitAccentWord = "ideas",
  toolkitIntro = "The primary tools and technologies I use to bring ideas to life.",
  column1Title = "Structural Engineering",
  column1Items = [],
  column2Title = "ML, Robotics & Research",
  column2Items = [],
  column3Title = "3D Design",
  column3Items = [],
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);

  const goldIdx = toolkitHeading.indexOf(toolkitAccentWord);
  const headingNode = goldIdx !== -1 ? (
    <>{toolkitHeading.slice(0, goldIdx)}<span className="text-gold">{toolkitAccentWord}</span>{toolkitHeading.slice(goldIdx + toolkitAccentWord.length)}</>
  ) : toolkitHeading;

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      if (h2Ref.current) {
        gsap.from(h2Ref.current, { opacity: 0, y: 40, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: h2Ref.current, start: "top 85%" } });
      }
      const items = sectionRef.current!.querySelectorAll<HTMLElement>(".toolkit-item");
      if (items.length) {
        gsap.fromTo(Array.from(items), { y: 20, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.03,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="toolkit"
      className="relative bg-cream text-dark-text py-20 lg:py-28 px-6 md:px-8 lg:px-16 overflow-hidden">
      <div className="section-number" data-number="07" aria-hidden="true" />
      <div className="max-w-[1280px] mx-auto">
        <div className="mb-12 md:mb-16 text-center">
          <p className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4">{toolkitLabel}</p>
          <h2 ref={h2Ref} className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-dark-text">
            {headingNode}
          </h2>
          {toolkitIntro && (
            <p className="text-dark-text/65 text-base mt-4 max-w-2xl mx-auto leading-relaxed">{toolkitIntro}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          <ToolColumn title={column1Title} items={column1Items} />
          <ToolColumn title={column2Title} items={column2Items} />
          <ToolColumn title={column3Title} items={column3Items} />
        </div>
      </div>
    </section>
  );
}
