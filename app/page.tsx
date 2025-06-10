import { IconMoodSmile } from '@tabler/icons-react';

export default function Home() {
  return (
    <section className="flex flex-col items-center gap-4 py-20">
      <IconMoodSmile size={48} stroke={1.5} />
      <h1 className="text-2xl font-bold">LexicalMini — Ready to Hack ✨</h1>
      <p className="text-zinc-500 dark:text-zinc-400">
        Skeleton app generated in Lesson 05. Time to add state next!
      </p>
    </section>
  );
}