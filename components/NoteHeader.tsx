"use client";
import { useRouter } from 'next/navigation';
import { useNoteStore } from '@/store';
import { IconX } from '@tabler/icons-react';
import AutosaveStatus from './AutosaveStatus'; // Added
import { toast } from 'sonner'; // Added

interface Props {
  noteId: string;
}

export default function NoteHeader({ noteId }: Props) {
  const router = useRouter();
  const { updateNote } = useNoteStore();

  const handleClose = async () => {
    updateNote(noteId, () => {}); // Trigger persistence
    await Promise.resolve(); // Wait for microtasks
    toast.success('Note saved'); // Added
    router.push('/');
  };

  return (
    <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 pb-2">
      <h2 className="text-lg font-semibold">Editing</h2>
      <div className="flex items-center gap-4"> {/* Wrapped in div */}
        <AutosaveStatus /> {/* Added */}
        <button
          onClick={handleClose}
          className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Close note"
        >
          <IconX size={20} />
        </button>
      </div>
    </div>
  );
}