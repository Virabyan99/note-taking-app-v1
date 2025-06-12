"use client";
export const runtime = 'edge';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useNoteStore } from '@/store';
import { use, useEffect } from 'react';
import { db } from '@/db/db';
import { noteSchema } from '@/types/types';
import NoteHeader from '@/components/NoteHeader';
import { AnimatePresence, motion } from 'framer-motion';



const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function NotePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const { _rehydrated, notes, setCurrent, createNote } = useNoteStore();
  const router = useRouter();

  useEffect(() => {
    setCurrent(resolvedParams.id);
    return () => setCurrent(null); // Cleanup on unmount
  }, [resolvedParams.id, setCurrent]);

  if (!_rehydrated) return null;

  let note = notes.find(n => n.id === resolvedParams.id);

  if (!note) {
    // Handle deep links by fetching from IndexedDB
    (async () => {
      const dbNote = await db.notes.get(resolvedParams.id);
      if (dbNote) {
        const validatedNote = noteSchema.parse(dbNote);
        await createNote(validatedNote); // Add to store
      } else {
        router.replace('/'); // Redirect to home if not found
      }
    })();
    return <div className="flex justify-center items-center min-h-screen text-zinc-600 dark:text-zinc-400">Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
        <NoteHeader noteId={note.id} />
        <div className="mt-4 border-t border-zinc-200 dark:border-zinc-700 pt-4">
          <Editor noteId={note.id} />
        </div>
      </div>
    </motion.div>
  );
}