import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiBookmark } from "react-icons/fi";
import {
  About,
  BackCover,
  Contact,
  CoverFront,
  Experience,
  ProjectsIntro,
  ProjectsMore,
  Resume,
  Services,
  Skills,
  TableOfContents,
  Testimonials,
} from "./pages";

type Side = "front" | "back";

type PageDef = {
  key: string;
  chapter?: string;
  variant: "cover" | "back-cover" | "content";
  render: (ctx: { onOpen: () => void; goTo: (i: number) => void }) => React.ReactNode;
};

// Each SHEET has a front + back; sheet indexes 0..N-1.
// When flipped, sheet[i].front (right) becomes hidden and sheet[i].back (left) shows.
type Sheet = { front: PageDef; back: PageDef };

const sheets: Sheet[] = [
  {
    // Sheet 0: cover (right) + TOC (revealed on back-left after opening)
    front: {
      key: "cover",
      variant: "cover",
      render: ({ onOpen }) => <CoverFront onOpen={onOpen} />,
    },
    back: {
      key: "toc",
      variant: "content",
      render: ({ goTo }) => (
        <TableOfContents
          chapters={["About", "Skills", "Experience", "Projects I", "Projects II", "Services", "Testimonials", "Résumé", "Contact"]}
          onGo={(i) => goTo(i + 2)}
        />
      ),
    },
  },
  // Sheet 1: About (right of spread 0/1) — but pairing works with our render
  {
    front: { key: "about", variant: "content", render: () => <About /> },
    back: { key: "skills", variant: "content", render: () => <Skills /> },
  },
  {
    front: { key: "experience", variant: "content", render: () => <Experience /> },
    back: { key: "projects1", variant: "content", render: () => <ProjectsIntro /> },
  },
  {
    front: { key: "projects2", variant: "content", render: () => <ProjectsMore /> },
    back: { key: "services", variant: "content", render: () => <Services /> },
  },
  {
    front: { key: "testimonials", variant: "content", render: () => <Testimonials /> },
    back: { key: "resume", variant: "content", render: () => <Resume /> },
  },
  {
    front: { key: "contact", variant: "content", render: () => <Contact /> },
    back: { key: "backcover", variant: "back-cover", render: () => <BackCover /> },
  },
];

// A "spread" is a state of the book after flipping N sheets:
// spread 0 = closed cover (only sheet 0 front visible on right)
// spread 1 = sheet 0 flipped (TOC visible on left, sheet 1 front visible on right)
// ...
// spread sheets.length = fully open at end (last sheet.back visible on left, back cover on right — but we treat back cover as the very last)
// We render N-1 spreads: after flipping all sheets we see back cover on left area.
// Simpler: total spreads = sheets.length. Spread i means "sheets [0..i-1] are flipped".
// At spread i:
//   left page  = sheets[i-1].back   (or nothing if i===0)
//   right page = sheets[i].front    (or back cover if i===sheets.length)

const TOTAL_SPREADS = sheets.length + 1; // includes final "closed back" state

type Props = Record<string, never>;

export function FlipBook(_props: Props) {
  const [spread, setSpread] = useState(0);
  const [flipping, setFlipping] = useState<{ index: number; direction: 1 | -1 } | null>(null);
  const flipLock = useRef(0);

  const goTo = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(TOTAL_SPREADS - 1, target));
      if (clamped === spread) return;
      // Trigger sequential flips
      setSpread(clamped);
    },
    [spread],
  );

  // Auto-open cover after intro
  useEffect(() => {
    const t = setTimeout(() => setSpread((s) => (s === 0 ? 1 : s)), 2200);
    return () => clearTimeout(t);
  }, []);

  const flipNext = useCallback(() => {
    const now = Date.now();
    if (now - flipLock.current < 850) return;
    if (spread >= TOTAL_SPREADS - 1) return;
    flipLock.current = now;
    setFlipping({ index: spread, direction: 1 });
    setTimeout(() => {
      setSpread((s) => s + 1);
      setFlipping(null);
    }, 800);
  }, [spread]);

  const flipPrev = useCallback(() => {
    const now = Date.now();
    if (now - flipLock.current < 850) return;
    if (spread <= 0) return;
    flipLock.current = now;
    setFlipping({ index: spread - 1, direction: -1 });
    setTimeout(() => {
      setSpread((s) => s - 1);
      setFlipping(null);
    }, 800);
  }, [spread]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") flipNext();
      if (e.key === "ArrowLeft" || e.key === "PageUp") flipPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipNext, flipPrev]);

  // Wheel
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 25) return;
      if (e.deltaY > 0) flipNext();
      else flipPrev();
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [flipNext, flipPrev]);

  // Touch
  useEffect(() => {
    let x = 0;
    const s = (e: TouchEvent) => (x = e.touches[0]!.clientX);
    const e2 = (e: TouchEvent) => {
      const dx = e.changedTouches[0]!.clientX - x;
      if (Math.abs(dx) < 40) return;
      if (dx < 0) flipNext();
      else flipPrev();
    };
    window.addEventListener("touchstart", s, { passive: true });
    window.addEventListener("touchend", e2, { passive: true });
    return () => {
      window.removeEventListener("touchstart", s);
      window.removeEventListener("touchend", e2);
    };
  }, [flipNext, flipPrev]);

  const [tocOpen, setTocOpen] = useState(false);

  const chapterLabels = useMemo(
    () => [
      "Cover",
      "Contents",
      "About",
      "Skills",
      "Experience",
      "Projects I",
      "Projects II",
      "Services",
      "Testimonials",
      "Résumé",
      "Contact",
      "Fin",
    ],
    [],
  );

  // Determine which sheet, if any, is currently in the middle of flipping
  const flippingSheet = flipping ? sheets[flipping.index] : null;

  // Left / right static pages (behind the flipping sheet)
  // When flipping forward (direction=1) from spread S to S+1:
  //   - The sheet sheets[S] is flipping from right→left.
  //   - Left static behind = sheets[S-1].back (previous back), still visible on left.
  //   - Right static behind = sheets[S+1].front (the new right page revealed underneath).
  //   - Front of flipping sheet (right-facing on flip) = sheets[S].front
  //   - Back of flipping sheet (left-facing after flip) = sheets[S].back
  // When flipping backward (direction=-1) from spread S to S-1:
  //   - The sheet sheets[S-1] is flipping from left→right.
  //   - Left static behind = sheets[S-2]?.back
  //   - Right static behind = sheets[S].front
  //   - Front (right after flip complete) = sheets[S-1].front
  //   - Back (currently left) = sheets[S-1].back

  const currentLeftSheet = spread > 0 ? sheets[spread - 1] : undefined;
  const currentRightSheet = spread < sheets.length ? sheets[spread] : undefined;

  const ctx = { onOpen: () => goTo(1), goTo: (i: number) => goTo(i) };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-4 py-16 md:px-10">
      {/* Top bar */}
      <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 md:px-10">
        <div className="font-display text-xs tracking-[0.35em] text-white/80 uppercase">
         Portfolio
        </div>
        <button
          onClick={() => setTocOpen((v) => !v)}
          className="glass flex items-center gap-2 rounded-full px-4 py-2 text-[10px] tracking-widest text-white uppercase transition hover:text-cyan"
        >
          <FiBookmark /> Contents
        </button>
      </header>

      {/* Book */}
      <div
        className="relative w-full max-w-[1100px]"
        style={{ perspective: 2400 }}
      >
        <div
          className="relative mx-auto flex aspect-[16/10] max-h-[80dvh] w-full items-stretch"
          style={{
            transformStyle: "preserve-3d",
            transform: "rotateX(4deg)",
            boxShadow:
              "0 45px 90px -25px rgba(0,0,0,0.7), 0 18px 34px -12px rgba(0,0,0,0.55)",
          }}
        >
          {/* Under-book shadow (grounds the book on a surface) */}
          <div className="pointer-events-none absolute -inset-x-8 -bottom-12 h-20 rounded-[50%] bg-black/70 blur-2xl" />
          <div className="pointer-events-none absolute -inset-x-20 -bottom-5 h-10 rounded-[50%] bg-black/45 blur-xl" />

          {/* Left page-block edge — simulates stacked paper thickness */}
          <div
            className="pointer-events-none absolute top-1 bottom-1 left-0 z-20 w-1.5 rounded-l-[14px]"
            style={{
              background:
                "repeating-linear-gradient(180deg, #efe8d6 0px, #efe8d6 1px, #d9d0b7 1px, #d9d0b7 2px)",
              boxShadow: "inset 2px 0 4px rgba(0,0,0,0.18), -1px 0 2px rgba(0,0,0,0.25)",
            }}
          />
          {/* Right page-block edge — simulates stacked paper thickness */}
          <div
            className="pointer-events-none absolute top-1 bottom-1 right-0 z-20 w-1.5 rounded-r-[14px]"
            style={{
              background:
                "repeating-linear-gradient(180deg, #efe8d6 0px, #efe8d6 1px, #d9d0b7 1px, #d9d0b7 2px)",
              boxShadow: "inset -2px 0 4px rgba(0,0,0,0.18), 1px 0 2px rgba(0,0,0,0.25)",
            }}
          />

          {/* Left page (static behind) */}
          <div
            className={`relative h-full ${spread === 0 ? 'w-0 flex-none' : 'flex-1'}`}
          >
            <PageSurface side="left" isCover={currentLeftSheet?.back.variant !== "content" && !!currentLeftSheet}>
              {currentLeftSheet ? currentLeftSheet.back.render(ctx) : null}
            </PageSurface>
          </div>

          {/* Spine — hardcover binding look */}
          <div
            className={`relative z-10 ${spread === 0 || spread === sheets.length ? 'w-0' : 'w-3'} transition-all duration-300`}
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 18%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.3) 82%, rgba(0,0,0,0.75) 100%)",
              boxShadow:
                "0 0 26px rgba(0,0,0,0.7), inset 0 0 10px rgba(0,0,0,0.55)",
            }}
          />

          {/* Right page (static behind) */}
          <div
            className={`relative h-full ${spread === sheets.length ? 'w-0 flex-none' : 'flex-1'}`}
          >
            <PageSurface
              side="right"
              isCover={
                currentRightSheet
                  ? currentRightSheet.front.variant !== "content"
                  : true // final: back cover
              }
            >
              {currentRightSheet
                ? currentRightSheet.front.render(ctx)
                : sheets[sheets.length - 1].back.render(ctx)}
            </PageSurface>
          </div>

          {/* Flipping sheet on top */}
          <AnimatePresence>
            {flippingSheet && (
              <FlipSheet
                key={`${flipping!.index}-${flipping!.direction}`}
                sheet={flippingSheet}
                direction={flipping!.direction}
                ctx={ctx}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Page corner hint (click to flip) */}
        {spread < TOTAL_SPREADS - 1 && (
          <button
            aria-label="Flip page"
            onClick={flipNext}
            className="group absolute right-0 bottom-0 z-20 h-16 w-16 md:h-20 md:w-20"
          >
            <span className="absolute right-0 bottom-0 h-full w-full origin-bottom-right rotate-0 bg-gradient-to-tl from-white/20 to-transparent transition-transform group-hover:scale-110" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%)" }} />
          </button>
        )}
      </div>

      {/* Nav controls */}
      <div className="z-30 mt-8 flex items-center gap-4">
        <button
          onClick={flipPrev}
          disabled={spread === 0}
          aria-label="Previous page"
          className="glass rounded-full p-3 text-white transition hover:text-cyan disabled:opacity-30"
        >
          <FiChevronLeft size={18} />
        </button>
        <div className="text-[10px] tracking-[0.35em] text-white/70 uppercase">
          {chapterLabels[Math.min(spread + 1, chapterLabels.length - 1)]} — {String(spread + 1).padStart(2, "0")}/{String(TOTAL_SPREADS).padStart(2, "0")}
        </div>
        <button
          onClick={flipNext}
          disabled={spread >= TOTAL_SPREADS - 1}
          aria-label="Next page"
          className="glass rounded-full p-3 text-white transition hover:text-cyan disabled:opacity-30"
        >
          <FiChevronRight size={18} />
        </button>
      </div>

      {/* TOC drawer */}
      <AnimatePresence>
        {tocOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 220, damping: 28 }}
            className="glass fixed top-0 right-0 z-40 h-full w-72 p-8"
          >
            <p className="text-[10px] tracking-[0.35em] text-cyan uppercase">
              Table of Contents
            </p>
            <ul className="mt-6 space-y-1">
              {chapterLabels.map((c, i) => (
                <li key={c + i}>
                  <button
                    onClick={() => {
                      goTo(i);
                      setTocOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                      i === spread
                        ? "bg-white/10 text-cyan"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{c}</span>
                    <span className="text-[10px] text-white/40">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

function PageSurface({
  side,
  children,
  isCover,
}: {
  side: Side | "left" | "right";
  children: React.ReactNode;
  isCover?: boolean;
}) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden ${
        side === "left" ? "rounded-l-[14px]" : "rounded-r-[14px]"
      }`}
      style={{
        background: isCover
          ? "linear-gradient(140deg,#0b1533 0%,#050914 55%,#0a1e4a 100%)"
          : "linear-gradient(180deg,#faf6ec 0%,#f2ebd8 100%)",
        boxShadow: isCover
          ? "inset 0 0 60px rgba(0,0,0,0.6), 0 20px 60px -20px rgba(37,99,235,0.4)"
          : "inset 0 0 40px rgba(0,0,0,0.06), inset 0 0 3px rgba(0,0,0,0.18)",
      }}
    >
      {/* Paper grain */}
      {!isCover && (
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.35) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
      )}
      {/* Inner spine shading */}
      <div
        className={`pointer-events-none absolute inset-y-0 ${
          side === "left" ? "right-0" : "left-0"
        } w-14`}
        style={{
          background:
            side === "left"
              ? "linear-gradient(90deg, transparent, rgba(0,0,0,0.25))"
              : "linear-gradient(-90deg, transparent, rgba(0,0,0,0.25))",
        }}
      />
      <div className="relative h-full w-full p-6 md:p-10">{children}</div>
    </div>
  );
}

function FlipSheet({
  sheet,
  direction,
  ctx,
}: {
  sheet: Sheet;
  direction: 1 | -1;
  ctx: { onOpen: () => void; goTo: (i: number) => void };
}) {
  // Flip from right (0deg) to left (-180deg) when direction=1
  // Or from left (-180deg) to right (0deg) when direction=-1
  const from = direction === 1 ? 0 : -180;
  const to = direction === 1 ? -180 : 0;

  return (
    <motion.div
      className="absolute top-0 right-0 left-1/2 h-full"
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: "left center",
        perspective: 2400,
      }}
      initial={{ rotateY: from }}
      animate={{ rotateY: to }}
      exit={{ rotateY: to }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Front face (right side when not flipped) */}
      <div
        className="absolute inset-0 overflow-hidden rounded-r-[14px]"
        style={{
          backfaceVisibility: "hidden",
          background:
            sheet.front.variant !== "content"
              ? "linear-gradient(140deg,#0b1533 0%,#050914 55%,#0a1e4a 100%)"
              : "linear-gradient(180deg,#faf6ec 0%,#f2ebd8 100%)",
          boxShadow:
            "inset 0 0 40px rgba(0,0,0,0.15), -8px 0 20px -6px rgba(0,0,0,0.35)",
        }}
      >
        {sheet.front.variant === "content" && (
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply"
            style={{
              backgroundImage: "radial-gradient(rgba(0,0,0,0.35) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
            }}
          />
        )}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-gradient-to-r from-black/25 to-transparent" />
        <div className="relative h-full w-full p-6 md:p-10">{sheet.front.render(ctx)}</div>
      </div>

      {/* Back face (left side after flip) */}
      <div
        className="absolute inset-0 overflow-hidden rounded-l-[14px]"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background:
            sheet.back.variant !== "content"
              ? "linear-gradient(140deg,#0b1533 0%,#050914 55%,#0a1e4a 100%)"
              : "linear-gradient(180deg,#faf6ec 0%,#f2ebd8 100%)",
          boxShadow:
            "inset 0 0 40px rgba(0,0,0,0.15), 8px 0 20px -6px rgba(0,0,0,0.35)",
        }}
      >
        {sheet.back.variant === "content" && (
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply"
            style={{
              backgroundImage: "radial-gradient(rgba(0,0,0,0.35) 1px, transparent 1px)",
              backgroundSize: "3px 3px",
            }}
          />
        )}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-gradient-to-l from-black/25 to-transparent" />
        <div className="relative h-full w-full p-6 md:p-10">{sheet.back.render(ctx)}</div>
      </div>
    </motion.div>
  );
}