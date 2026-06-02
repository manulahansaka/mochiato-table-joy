import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero.jpg";
import shawarmaImg from "@/assets/dish-shawarma.jpg";
import burgerImg from "@/assets/dish-burger.jpg";
import subImg from "@/assets/dish-sub.jpg";
import interiorImg from "@/assets/cafe-interior.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mochiato Gampaha — Craft Coffee, Shawarma & Burgers" },
      {
        name: "description",
        content:
          "Mochiato Gampaha — craft coffee, signature shawarma, burgers and submarines. Reserve a study table by the hour. Call to book.",
      },
    ],
  }),
  component: Index,
});

const signatures = [
  {
    img: shawarmaImg,
    name: "Chicken + Cheese Shawarma",
    price: "Rs. 1,390",
    desc: "Pan-fried chicken, melted cheese, onion & fresh greens, wrapped warm.",
  },
  {
    img: burgerImg,
    name: "Double Beef Cheeseburger",
    price: "Rs. 1,590",
    desc: "Two seared beef patties, double cheese, lettuce, tomato, golden fries.",
  },
  {
    img: subImg,
    name: "Grilled Chicken Submarine",
    price: "Rs. 1,490",
    desc: "Toasted sub loaded with grilled chicken, herbs, fresh salad & sauce.",
  },
];

function Index() {
  return (
    <>
      {/* HERO */}
      <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Mochiato Gampaha — craft coffee and food"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/75 via-espresso/55 to-espresso/95" />
        <div className="absolute inset-0 grain opacity-40" />

        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center px-5 text-center text-cream animate-fade-in">
          <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-primary/90 md:text-xs">
            ☕  Gampaha · Sri Lanka  ☕
          </p>
          <h1 className="font-display text-6xl font-bold text-balance md:text-8xl">
            Mochiato<span className="text-primary">.</span>
          </h1>
          <p className="mt-5 max-w-xl font-display text-xl italic text-cream/90 md:text-2xl">
            Where Coffee Meets Comfort Food
          </p>
          <p className="mt-4 max-w-md text-sm text-cream/70 md:text-base">
            Craft espresso, sizzling shawarma, juicy burgers and quiet study tables —
            all under one roof.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground shadow-2xl shadow-primary/40 transition-all hover:scale-105 hover:bg-primary/90"
            >
              View Menu →
            </Link>
            <Link
              to="/reservations"
              className="inline-flex items-center gap-2 rounded-full border border-cream/40 bg-cream/5 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-cream backdrop-blur-sm transition-all hover:scale-105 hover:bg-cream/15"
            >
              Reserve a Table
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-6 text-xs uppercase tracking-[0.3em] text-cream/60">
            <span>Open Daily</span>
            <span className="h-1 w-1 rounded-full bg-primary" />
            <span>Hourly Tables</span>
            <span className="hidden h-1 w-1 rounded-full bg-primary sm:inline-block" />
            <span className="hidden sm:inline">Dine-In · Takeaway</span>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-cream/60 animate-bounce">
          <span className="text-2xl">↓</span>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: "☕",
              t: "Craft Coffee",
              d: "Single-origin beans pulled shot by shot — espresso, lattes & specials.",
            },
            {
              icon: "🥙",
              t: "Fresh Eats",
              d: "Shawarma, gourmet burgers and loaded submarines, made to order.",
            },
            {
              icon: "📚",
              t: "Study by the Hour",
              d: "Quiet tables you can book hourly. Call us to lock in your spot.",
            },
          ].map((b) => (
            <div
              key={b.t}
              className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl"
            >
              <div className="mb-3 text-4xl transition-transform group-hover:scale-110">
                {b.icon}
              </div>
              <h3 className="font-display text-2xl">{b.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SIGNATURE DISHES */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-primary">Tasting Menu</p>
            <h2 className="font-display text-4xl md:text-5xl">Signature Plates</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              A taste of what people drive across town for.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {signatures.map((s) => (
              <article
                key={s.name}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.name}
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl leading-tight">{s.name}</h3>
                    <span className="shrink-0 font-display text-lg text-primary">{s.price}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              Explore Full Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* STORY / RESERVE STRIP */}
      <section className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={interiorImg}
              alt="Inside Mochiato Gampaha"
              width={1280}
              height={896}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-primary">Our Space</p>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              A second home for coffee, food & focus.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Mochiato is a neighbourhood cafe in the heart of Gampaha. Warm wood,
              soft light, free Wi-Fi, and tables you can book by the hour for study
              groups, quick meetings or a long afternoon to yourself.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Open</p>
                <p className="mt-1 font-display text-lg">Mon–Sun · 8am – 11pm</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Find Us</p>
                <p className="mt-1 font-display text-lg">Gampaha</p>
              </div>
            </div>

            <Link
              to="/reservations"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:scale-105"
            >
              Check Table Availability →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="relative overflow-hidden bg-espresso text-cream">
        <div className="absolute inset-0 grain opacity-30" />
        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center">
          <h2 className="font-display text-4xl md:text-5xl">Hungry yet?</h2>
          <p className="mx-auto mt-4 max-w-lg text-cream/75">
            Drop by, dial in, or browse the menu — we'll have a cup waiting.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/menu"
              className="rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-transform hover:scale-105"
            >
              See the Menu
            </Link>
            <Link
              to="/reservations"
              className="rounded-full border border-cream/40 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-cream transition-colors hover:bg-cream/10"
            >
              Reserve a Table
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
