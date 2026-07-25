import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const BookExperience = lazy(() =>
  import("@/components/book/BookExperience").then((m) => ({
    default: m.BookExperience,
  })),
);
const Cursor = lazy(() =>
  import("@/components/ui/Cursor").then((m) => ({ default: m.Cursor })),
);

export const Route = createFileRoute("/")({
  component: Index,
});

function Fallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#07070a]">
      <div className="text-xs tracking-[0.4em] text-cyan uppercase animate-pulse">
        Loading portfolio…
      </div>
    </div>
  );
}

function Index() {
  return (
    <div className="relative">
      <ClientOnly fallback={<Fallback />}>
        <Suspense fallback={<Fallback />}>
          <Cursor />
          <BookExperience />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
