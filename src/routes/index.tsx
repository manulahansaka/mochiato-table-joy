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
      <section className="relative flex min-h-[100svh] w-full items-center overflow-hidden py-20 sm:py-24">
        <img
          src={heroImg}
          alt="Mochiato Gampaha — craft coffee and food"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/75 via-espresso/55 to-espresso/95" />
        <div className="absolute inset-0 grain opacity-40" />

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 text-center text-cream animate-fade-in sm:px-6">
          <p className="mb-3 text-[9px] uppercase tracking-[0.4em] text-primary/90 sm:mb-4 sm:text-[10px] sm:tracking-[0.5em] md:text-xs">
            ☕  Gampaha · Sri Lanka  ☕
          </p>
          <h1 className="font-display text-5xl font-bold text-balance sm:text-6xl md:text-7xl lg:text-8xl">
            Mochiato<span className="text-primary">.</span>
          </h1>
          <p className="mt-4 max-w-xl font-display text-lg italic text-cream/90 sm:mt-5 sm:text-xl md:text-2xl">
            Where Coffee Meets Comfort Food
          </p>
          <p className="mt-3 max-w-md text-xs text-cream/70 sm:mt-4 sm:text-sm md:text-base">
            Craft espresso, sizzling shawarma, juicy burgers and quiet study tables —
            all under one roof.
          </p>

          <div className="mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-10 sm:w-auto sm:max-w-none sm:flex-row sm:gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-2xl shadow-primary/40 transition-all hover:scale-105 hover:bg-primary/90 sm:px-8 sm:py-4 sm:text-sm sm:tracking-[0.2em]"
            >
              View Menu →
            </Link>
            <Link
              to="/reservations"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-cream/40 bg-cream/5 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-cream backdrop-blur-sm transition-all hover:scale-105 hover:bg-cream/15 sm:px-8 sm:py-4 sm:text-sm sm:tracking-[0.2em]"
            >
              Reserve a Table
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.25em] text-cream/60 sm:gap-x-6 sm:text-xs sm:tracking-[0.3em]">
            <span>Open Daily</span>
            <span className="h-1 w-1 rounded-full bg-primary" />
            <span>Hourly Tables</span>
            <span className="h-1 w-1 rounded-full bg-primary" />
            <span>Dine-In · Takeaway</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 text-cream/60 animate-bounce sm:block">
          <span className="text-2xl">↓</span>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3">
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
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/60 hover:shadow-xl sm:p-7"
            >
              <div className="mb-3 text-3xl transition-transform group-hover:scale-110 sm:text-4xl">
                {b.icon}
              </div>
              <h3 className="font-display text-xl sm:text-2xl">{b.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground sm:mt-3">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SIGNATURE DISHES */}
      <section className="bg-secondary/40 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center sm:mb-12">
            <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-primary sm:text-xs sm:tracking-[0.4em]">
              Tasting Menu
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">Signature Plates</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
              A taste of what people drive across town for.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
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
                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg leading-tight sm:text-xl">{s.name}</h3>
                    <span className="shrink-0 font-display text-base text-primary sm:text-lg">
                      {s.price}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 text-center sm:mt-12">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary transition-all hover:bg-primary hover:text-primary-foreground sm:px-8 sm:text-sm sm:tracking-[0.2em]"
            >
              Explore Full Menu →
            </Link>
          </div>
        </div>
      </section>

      {/* STORY / RESERVE STRIP */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid items-center gap-8 sm:gap-12 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl shadow-2xl sm:rounded-3xl">
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
            <p className="mb-3 text-[10px] uppercase tracking-[0.35em] text-primary sm:text-xs sm:tracking-[0.4em]">
              Our Space
            </p>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
              A second home for coffee, food & focus.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground sm:mt-5 sm:text-base">
              Mochiato is a neighbourhood cafe in the heart of Gampaha. Warm wood,
              soft light, free Wi-Fi, and tables you can book by the hour for study
              groups, quick meetings or a long afternoon to yourself.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4">
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">
                  Open
                </p>
                <p className="mt-1 font-display text-base sm:text-lg">8am – 11pm</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground sm:text-xs">
                  Find Us
                </p>
                <p className="mt-1 font-display text-base sm:text-lg">Gampaha</p>
              </div>
            </div>

            <Link
              to="/reservations"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-all hover:scale-105 sm:mt-8 sm:w-auto sm:text-sm sm:tracking-[0.2em]"
            >
              Check Table Availability →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="relative overflow-hidden bg-espresso text-cream">
        <div className="absolute inset-0 grain opacity-30" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl">Hungry yet?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-cream/75 sm:mt-4 sm:text-base">
            Drop by, dial in, or browse the menu — we'll have a cup waiting.
          </p>
          <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:mt-8 sm:flex-row sm:items-center">
            <Link
              to="/menu"
              className="rounded-full bg-primary px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-transform hover:scale-105 sm:text-sm sm:tracking-[0.2em]"
            >
              See the Menu
            </Link>
            <Link
              to="/reservations"
              className="rounded-full border border-cream/40 px-8 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-cream transition-colors hover:bg-cream/10 sm:text-sm sm:tracking-[0.2em]"
            >
              Reserve a Table
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
