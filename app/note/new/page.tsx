"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNoteStore } from '@/store';

export default function NewNotePage() {
  const router = useRouter();
  const createNote = useNoteStore(s => s.createNote);

  useEffect(() => {
    (async () => {
      const note = await createNote();
      router.replace(`/note/${note.id}`);
    })();
  }, [createNote, router]);

  return null; // Redirects immediately
}