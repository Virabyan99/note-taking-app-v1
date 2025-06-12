"use client";
import dynamic from 'next/dynamic';
import { notFound, useRouter } from 'next/navigation';
import { useNoteStore } from '@/store';
import { use, useEffect } from 'react';
import { db } from '@/db/db';
import { noteSchema } from '@/types/types';
import NoteHeader from '@/components/NoteHeader';

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
    return null; // Wait for async fetch
  }

  return (
    <div className="container mx-auto py-8 flex flex-col gap-4">
      <NoteHeader noteId={note.id} />
      <Editor noteId={note.id} />
    </div>
  );
}