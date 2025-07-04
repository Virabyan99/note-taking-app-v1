"use client";
import { useState } from 'react';
import { useNoteStore } from '@/store';
import { IconPhotoPlus, IconSun, IconMoon } from '@tabler/icons-react';
import { toast } from 'sonner';
import { INSERT_IMAGE_COMMAND } from '@/nodes/ImageNode';
import React from 'react';
import CollectionDialog from './CollectionDialog';
import SettingsDialog from './SettingsDialog';
import SaveNoteDialog from './SaveNoteDialog';
import { Save } from 'lucide-react';

export default function Header() {
  const { settings, setSettings, currentId, editorInstance } = useNoteStore();
  const isDark = settings.theme === 'dark';
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);

  const toggleTheme = () => {
    setSettings({ theme: isDark ? 'light' : 'dark' });
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
        <CollectionDialog />
        <SettingsDialog />
        {currentId && (
          <>
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
              disabled={!editorInstance}
            >
              <IconPhotoPlus size={16} className="inline mr-1" />
            </button>
            <button
              onClick={() => setIsSaveDialogOpen(true)}
              className="rounded p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
              aria-label="Save note"
            >
              <Save size={20} />
            </button>
          </>
        )}
        <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2">
          {isDark ? <IconMoon size={20} /> : <IconSun size={20} />}
        </button>
      </div>
      <SaveNoteDialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen} />
    </header>
  );
}