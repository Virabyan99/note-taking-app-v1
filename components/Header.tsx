"use client";
import { useNoteStore } from '@/store';
import { Switch } from './ui/switch';
import { IconX, IconPhotoPlus } from '@tabler/icons-react';
import AutosaveStatus from './AutosaveStatus';
import { toast } from 'sonner';
import { INSERT_IMAGE_COMMAND } from '@/nodes/ImageNode';
import React from 'react';

export default function Header() {
  const { settings, setSettings, currentId, closeCurrentNote, editorInstance } = useNoteStore();
  const isDark = settings.theme === 'dark';
  const inputRef = React.useRef<HTMLInputElement>(null);

  const toggleTheme = () => {
    setSettings({ theme: isDark ? 'light' : 'dark' });
  };

  const handleCloseNote = async () => {
    if (currentId) {
      await closeCurrentNote();
      toast.success('Note saved');
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || !editorInstance) return;
    Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .forEach((f) => {
        const src = URL.createObjectURL(f);
        editorInstance.dispatchCommand(INSERT_IMAGE_COMMAND, { src, alt: f.name });
      });
  };

  return (
    <header className="flex items-center justify-between p-4">
      <h1 className="text-xl font-bold">LexicalMini</h1>
      <div className="flex items-center gap-4">
        {currentId && (
          <>
            <AutosaveStatus />
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              ref={inputRef}
              onChange={(e) => handleFiles(e.target.files)}
            />
            <button
              onClick={() => inputRef.current?.click()}
              className="rounded border px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
              disabled={!editorInstance} // Disable if no editor instance
            >
              <IconPhotoPlus size={16} className="inline mr-1" /> Image
            </button>
            <button
              onClick={handleCloseNote}
              className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
              aria-label="Close note"
            >
              <IconX size={20} />
            </button>
          </>
        )}
        <Switch
          checked={isDark}
          onCheckedChange={toggleTheme}
          aria-label="Toggle dark mode"
        />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">Dark Mode</span>
      </div>
    </header>
  );
}