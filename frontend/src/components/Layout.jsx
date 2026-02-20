import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-24 h-72 w-72 animate-float rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-1/4 top-40 h-80 w-80 animate-float rounded-full bg-amber-400/20 blur-3xl [animation-delay:1.5s]" />
        <div className="absolute bottom-10 left-1/3 h-72 w-72 animate-float rounded-full bg-fuchsia-500/15 blur-3xl [animation-delay:3s]" />
      </div>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
