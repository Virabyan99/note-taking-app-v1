"use client";
import { useEffect, useState } from 'react';
import { useNoteStore } from '@/store';
import NoteHeader from '@/components/NoteHeader';
import Editor from '@/components/Editor';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function Home() {
  const { _rehydrated, notes, createNote, setCurrent, updateNote } = useNoteStore();
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);

  useEffect(() => {
    if (_rehydrated && !currentNoteId) {
      (async () => {
        const newNote = await createNote();
        setCurrentNoteId(newNote.id);
        setCurrent(newNote.id);
      })();
    }
  }, [_rehydrated, createNote, setCurrent, currentNoteId]);

  if (!_rehydrated) return null;

  const handleClose = async () => {
    if (currentNoteId) {
      await updateNote(currentNoteId, () => {});
      toast.success('Note saved');
    }
    const newNote = await createNote();
    setCurrentNoteId(newNote.id);
    setCurrent(newNote.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6">
        {currentNoteId && (
          <>
            <NoteHeader noteId={currentNoteId} onClose={handleClose} />
            <div className="mt-4 pt-4">
              <Editor noteId={currentNoteId} />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}