export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center gap-6 text-dark-text">
      <p className="font-[Cormorant_Garamond] text-2xl">Page not found.</p>
      <a
        href="/"
        className="border border-gold text-gold px-6 py-2 text-sm tracking-widest uppercase hover:bg-gold hover:text-white transition-colors"
      >
        Return home
      </a>
    </div>
  );
}
