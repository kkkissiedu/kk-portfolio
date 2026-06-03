"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

type ContactProps = {
  contactLabel?: string;
  contactHeading?: string;
  contactHeadingGoldWord?: string;
  contactSubtext?: string;
  contactEmail?: string;
  contactLocation?: string;
};

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/kkkissiedu",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.165 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "http://www.youtube.com/@kkkissiedu",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/kkkissiedu",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

const INPUT_CLASS =
  "w-full bg-white border border-dark-text/20 focus:border-gold text-dark-text placeholder:text-dark-text/40 px-4 py-3 outline-none transition-colors duration-300 font-body text-sm";

export default function Contact({
  contactLabel = "Get In Touch",
  contactHeading = "Let's Connect",
  contactHeadingGoldWord = "Connect",
  contactSubtext = "Have a project in mind or just want to say hi? Feel free to reach out.",
  contactEmail = "kissiedukwabena4@gmail.com",
  contactLocation = "Kumasi, Ghana",
}: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const h2Line1Ref = useRef<HTMLDivElement>(null);
  const h2Line2Ref = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "",
  });
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Split heading at gold word: line 1 = before gold word, line 2 = gold word (and beyond)
  const goldIdx = contactHeading.indexOf(contactHeadingGoldWord);
  let headingLine1 = contactHeading;
  let headingLine2 = "";
  if (goldIdx !== -1) {
    headingLine1 = contactHeading.slice(0, goldIdx).trim();
    headingLine2 = contactHeading.slice(goldIdx).trim();
  }
  const goldInLine2 = headingLine2.indexOf(contactHeadingGoldWord) !== -1;

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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "", website: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-anthracite py-20 lg:py-28 px-6 md:px-8 lg:px-16 overflow-hidden"
    >
      {/* Decorative section number */}
      <div className="section-number" data-number="05" aria-hidden="true" />

      <div className="max-w-[1280px] mx-auto">
        {/* Section header */}
        <div className="mb-12">
          <p className="text-sm md:text-base tracking-[0.4em] font-semibold uppercase text-gold mb-4">
            {contactLabel}
          </p>
          <h2 className="text-cream text-4xl md:text-5xl lg:text-6xl leading-tight">
            {headingLine1 && (
              <div className="overflow-hidden">
                <div ref={h2Line1Ref} data-gsap="true">
                  {headingLine1}
                </div>
              </div>
            )}
            {headingLine2 && (
              <div className="overflow-hidden">
                <div ref={h2Line2Ref} data-gsap="true">
                  {goldInLine2 ? (
                    <>
                      {headingLine2.slice(0, headingLine2.indexOf(contactHeadingGoldWord))}
                      <span className="text-gold">{contactHeadingGoldWord}</span>
                      {headingLine2.slice(headingLine2.indexOf(contactHeadingGoldWord) + contactHeadingGoldWord.length)}
                    </>
                  ) : (
                    headingLine2
                  )}
                </div>
              </div>
            )}
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — company info */}
          <div className="flex flex-col gap-10">
            <div>
              <p className="text-white/80 text-sm leading-relaxed max-w-sm">
                {contactSubtext}
              </p>
            </div>

            {/* Info items */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-gold text-xs tracking-widest uppercase mb-1">
                  Email
                </p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-cream/80 hover:text-gold transition-colors duration-300 text-sm"
                >
                  {contactEmail}
                </a>
              </div>

              <div>
                <p className="text-gold text-xs tracking-widest uppercase mb-1">
                  Location
                </p>
                <p className="text-cream/80 text-sm">
                  {contactLocation}
                </p>
              </div>
            </div>

            {/* Gold divider */}
            <div className="w-12 h-px bg-gold" />

            {/* Social links */}
            <div>
              <p className="text-gold text-xs tracking-widest uppercase mb-4">
                Follow Us
              </p>
              <div className="flex items-center gap-4">
                {SOCIAL_LINKS.map(({ label, href, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-white/70 hover:text-gold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {status === "success" ? (
              <div className="flex flex-col items-start gap-4 py-12">
                <div className="w-12 h-px bg-gold" />
                <h3 className="text-cream text-2xl">
                  Message Received
                </h3>
                <p className="text-white/80 text-sm">
                  Thank you for reaching out. We&apos;ll be in touch shortly.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-gold text-sm tracking-widest uppercase border-b border-gold/40 hover:border-gold transition-colors duration-300 pb-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <input
                  type="text"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  autoComplete="off"
                  tabIndex={-1}
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }}
                />
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-white/80 text-xs tracking-widest uppercase mb-2"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={INPUT_CLASS}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-white/80 text-xs tracking-widest uppercase mb-2"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={INPUT_CLASS}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-white/80 text-xs tracking-widest uppercase mb-2"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className={INPUT_CLASS}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-white/80 text-xs tracking-widest uppercase mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    className={`${INPUT_CLASS} resize-none`}
                  />
                </div>

                {status === "error" && (
                  <p className="text-red-400 text-sm">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full bg-gold text-anthracite hover:bg-gold-highlight disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 px-8 py-4 text-sm tracking-widest uppercase font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-anthracite"
                >
                  {status === "loading" ? "Sending…" : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
