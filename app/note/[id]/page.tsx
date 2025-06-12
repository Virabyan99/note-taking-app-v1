"use client";
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { useNoteStore } from '@/store';
import { use } from 'react'; // Import use from React

const Editor = dynamic(() => import('@/components/Editor'), {
  ssr: false,
});

interface PageProps {
  params: Promise<{ id: string }>; // Update type to reflect params as a Promise
}

export default function NotePage({ params }: PageProps) {
  const resolvedParams = use(params); // Unwrap the Promise to get the params object
  const { _rehydrated, notes, createNote } = useNoteStore();

  if (!_rehydrated) return null;

  let note = notes.find(n => n.id === resolvedParams.id); // Use resolvedParams.id

  if (!note) {
    if (resolvedParams.id === 'new') { // Use resolvedParams.id
      note = createNote();
    } else {
      notFound();
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Editor noteId={resolvedParams.id} /> {/* Use resolvedParams.id */}
    </div>
  );
}