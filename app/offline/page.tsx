import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LexicalMini — Offline",
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-50 p-8 text-center dark:bg-zinc-900">
      <h1 className="text-2xl font-bold">You’re offline</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Keep writing—changes will sync when connection is restored.
      </p>
    </div>
  );
}