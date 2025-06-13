"use client";
import { useNoteStore } from '@/store';
import { IconX } from '@tabler/icons-react';
import AutosaveStatus from './AutosaveStatus';

interface Props {
  noteId: string;
  onClose: () => void; // Add onClose to the Props interface
}

export default function NoteHeader({ noteId, onClose }: Props) {
  const { notes } = useNoteStore();
  const note = notes.find(n => n.id === noteId);

  return (
    <div className="flex items-center justify-between  pb-2">
      <div className="flex items-center gap-4">
        <AutosaveStatus />
        <button
          onClick={onClose} // Call the passed onClose function
          className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
          aria-label="Close note"
        >
          <IconX size={20} />
        </button>
      </div>
    </div>
  );
}