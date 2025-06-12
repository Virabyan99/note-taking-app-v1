import { IconMoodSmile } from '@tabler/icons-react';
import Link from 'next/link';

export default function Home() {
  return (
    <section className="flex flex-col items-center gap-4 py-20">
      <IconMoodSmile size={48} stroke={1.5} />
      <h1 className="text-2xl font-bold">LexicalMini — Ready to Hack ✨</h1>
      <p className="text-zinc-500 dark:text-zinc-400">
        Skeleton app generated in Lesson 05. Time to add state next!
      </p>
      <Link
        className="rounded bg-brand px-4 py-2 font-medium text-gray-800 shadow"
        href="/note/new"
      >
        New Note
      </Link>
    </section>
  );
}