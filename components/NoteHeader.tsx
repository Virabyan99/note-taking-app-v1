"use client";
import { useRouter } from 'next/navigation';
import { useNoteStore } from '@/store';
import { IconX } from '@tabler/icons-react';
import AutosaveStatus from './AutosaveStatus';
import { toast } from 'sonner';

interface Props {
  noteId: string;
}

export default function NoteHeader({ noteId }: Props) {
  const router = useRouter();
  const { updateNote, notes } = useNoteStore();
  const note = notes.find(n => n.id === noteId);

  const handleClose = async () => {
    updateNote(noteId, () => {}); // Trigger persistence
    await Promise.resolve(); // Wait for microtasks
    toast.success('Note saved');
    router.push('/');
  };

  return (
    <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 pb-2">
      <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
        {note?.title || 'Untitled'}
      </h2>
      <div className="flex items-center gap-4">
        <AutosaveStatus />
        <button
          onClick={handleClose}
          className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
          aria-label="Close note"
        >
          <IconX size={20} />
        </button>
      </div>
    </div>
  );
}