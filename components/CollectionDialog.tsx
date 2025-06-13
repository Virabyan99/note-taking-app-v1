'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useState } from 'react';
import { useNoteStore } from '@/store';
import { IconLayoutGrid, IconList, IconTrash } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

export default function CollectionDialog() {
  const [open, setOpen] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const notes = useNoteStore((s) => s.notes);
  const setCurrent = useNoteStore((s) => s.setCurrent);
  const deleteNote = useNoteStore((s) => s.deleteNote);
  const deleteAllNotes = useNoteStore((s) => s.deleteAllNotes);

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
  };

  const handleDeleteAllNotes = () => {
    deleteAllNotes();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          All Notes
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <VisuallyHidden asChild>
            <DialogTitle>Your Notes ({notes.length})</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <header className="mb-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={layout === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setLayout('grid')}
              aria-label="Grid view"
            >
              <IconLayoutGrid size={18} />
            </Button>
            <Button
              variant={layout === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setLayout('list')}
              aria-label="List view"
            >
              <IconList size={18} />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDeleteAllNotes}
              aria-label="Delete all notes"
            >
              <IconTrash size={18} />
            </Button>
          </div>
        </header>

        {layout === 'grid' ? (
          <ul
            className="grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto pr-2"
            role="list"
          >
            {notes.map((n) => (
              <li key={n.id} className="flex items-center justify-between">
                <button
                  className="w-full text-left block rounded border p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => {
                    setCurrent(n.id);
                    setOpen(false);
                  }}
                >
                  <h3 className="truncate font-medium">{n.title}</h3>
                  <p className="text-xs text-zinc-500">
                    {new Date(n.updatedAt).toLocaleString()}
                  </p>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteNote(n.id)}
                  aria-label={`Delete note ${n.title}`}
                >
                  <IconTrash size={16} />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <ul
            className="max-h-[60vh] space-y-2 overflow-y-auto pr-2"
            role="list"
          >
            {notes.map((n) => (
              <li key={n.id} className="flex items-center justify-between">
                <button
                  className="w-full text-left flex items-center justify-between rounded border p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => {
                    setCurrent(n.id);
                    setOpen(false);
                  }}
                >
                  <span className="truncate">{n.title}</span>
                  <span className="ml-2 shrink-0 text-xs text-zinc-500">
                    {new Date(n.updatedAt).toLocaleDateString()}
                  </span>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteNote(n.id)}
                  aria-label={`Delete note ${n.title}`}
                >
                  <IconTrash size={16} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  );
}