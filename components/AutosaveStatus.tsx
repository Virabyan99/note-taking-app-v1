"use client";
import { useNoteStore } from '@/store';

export default function AutosaveStatus() {
  const saveState = useNoteStore(s => s.saveState);
  return (
    <span className="text-sm text-zinc-500 dark:text-zinc-400">
      {saveState === 'saving' ? 'Saving…' : 'Saved'}
    </span>
  );
}