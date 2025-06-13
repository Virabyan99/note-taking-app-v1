'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useState, useMemo, useEffect } from 'react';
import { useNoteStore } from '@/store';
import { IconLayoutGrid, IconList, IconTrash, IconArrowDown, IconArrowUp } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import Fuse from 'fuse.js';
import debounce from 'lodash.debounce';

export default function CollectionDialog() {
  const [open, setOpen] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const notes = useNoteStore((s) => s.notes);
  const setCurrent = useNoteStore((s) => s.setCurrent);
  const deleteNote = useNoteStore((s) => s.deleteNote);
  const deleteAllNotes = useNoteStore((s) => s.deleteAllNotes);
  const flush = useNoteStore((s) => s.flush); // Added

  const fuse = useMemo(() => {
    return new Fuse(notes, {
      keys: ['title', 'body'],
      includeScore: true,
      threshold: 0.4,
    });
  }, [notes]);

  const results = query ? fuse.search(query).map((r) => r.item) : notes;

  const sortedNotes = useMemo(() => {
    return [...results].sort((a, b) =>
      sortDir === 'desc' ? b.updatedAt - a.updatedAt : a.updatedAt - b.updatedAt
    );
  }, [results, sortDir]);

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
  };

  const handleDeleteAllNotes = () => {
    deleteAllNotes();
  };

  const debouncedSetQuery = useMemo(() => debounce(setQuery, 200), []);

  useEffect(() => {
    return () => {
      debouncedSetQuery.cancel();
    };
  }, [debouncedSetQuery]);

  const handleSelect = async (id: string) => {
    if (flush) {
      await flush(); // Flush autosave before switching
    }
    setCurrent(id); // Switch to the selected note
    setOpen(false); // Close the dialog
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
          <input
            type="search"
            placeholder="Search notes..."
            onChange={(e) => debouncedSetQuery(e.target.value)}
            className="flex-1 rounded border px-2 py-1 text-sm dark:bg-zinc-800"
            aria-label="Search notes"
          />
          <div className="flex gap-2">
            <Button
              variant={layout === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setLayout('grid')}
              aria-label="Grid view">
              <IconLayoutGrid size={18} />
            </Button>
            <Button
              variant={layout === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setLayout('list')}
              aria-label="List view">
              <IconList size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
              aria-label={`Sort ${
                sortDir === 'desc' ? 'oldest' : 'newest'
              } first`}>
              {sortDir === 'desc' ? (
                <IconArrowDown size={18} />
              ) : (
                <IconArrowUp size={18} />
              )}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDeleteAllNotes}
              aria-label="Delete all notes">
              <IconTrash size={18} />
            </Button>
          </div>
        </header>

       {layout === 'grid' ? (
          <ul className="grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto pr-2" role="list">
            {sortedNotes.map((n) => (
              <li key={n.id} className="flex items-center justify-between">
                <button
                  className="w-full text-left block rounded border p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => handleSelect(n.id)} // Updated to use handleSelect
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
                  aria-label={`Delete note ${n.title}`}>
                  <IconTrash size={16} />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="max-h-[60vh] space-y-2 overflow-y-auto pr-2" role="list">
            {sortedNotes.map((n) => (
              <li key={n.id} className="flex items-center justify-between">
                <button
                  className="w-full text-left flex items-center justify-between rounded border p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => handleSelect(n.id)} // Updated to use handleSelect
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
                  aria-label={`Delete note ${n.title}`}>
                  <IconTrash size={16} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
