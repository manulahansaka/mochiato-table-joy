import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mochiato Gampaha — Where Coffee Meets Mochi" },
      { name: "description", content: "Craft coffee and handmade mochi in Gampaha, Sri Lanka. Hourly table reservations available." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Steaming coffee beside pastel mochi at Mochiato Gampaha"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/70 via-espresso/55 to-espresso/85" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center text-cream">
          <p className="mb-4 text-xs uppercase tracking-[0.4em] text-cream/70">Gampaha · Sri Lanka</p>
          <h1 className="font-display text-6xl font-bold text-balance md:text-8xl">
            Mochiato<span className="text-primary">.</span>
          </h1>
          <p className="mt-5 max-w-xl font-display text-xl italic text-cream/85 md:text-2xl">
            Where Coffee Meets Mochi
          </p>
          <Link
            to="/menu"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:scale-105 hover:bg-primary/90"
          >
            View Menu →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-24">
        <div className="grid gap-12 md:grid-cols-3">
          {[
            { t: "Single-origin coffee", d: "Beans roasted weekly from Sri Lanka's hill country, pulled shot by shot." },
            { t: "Handmade mochi", d: "Soft rice cakes filled fresh each morning — strawberry, matcha, hazelnut." },
            { t: "Quiet study tables", d: "Hourly reservations let you settle in for a chapter, a chat, or a chess match." },
          ].map((b) => (
            <div key={b.t} className="rounded-2xl border border-border bg-card p-7 transition-transform hover:-translate-y-1">
              <h3 className="font-display text-2xl">{b.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
