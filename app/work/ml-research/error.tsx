"use client";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6 text-dark-text">
      <p className="font-[Cormorant_Garamond] text-2xl">Something went wrong.</p>
      <button
        onClick={reset}
        className="border border-gold text-gold px-6 py-2 text-sm tracking-widest uppercase hover:bg-gold hover:text-white transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
