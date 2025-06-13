"use client";
import { useEffect } from 'react';
import { useNoteStore } from '@/store';
import Editor from '@/components/Editor';
import { motion } from 'framer-motion';

export default function Home() {
  const { _rehydrated, createNote, setCurrent, currentId } = useNoteStore();

  useEffect(() => {
    if (_rehydrated && !currentId) {
      (async () => {
        const newNote = await createNote();
        setCurrent(newNote.id);
      })();
    }
  }, [_rehydrated, createNote, setCurrent, currentId]);

  if (!_rehydrated) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-2 sm:px-6 lg:px-8"
    >
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-2">
        {currentId && <Editor noteId={currentId} />}
      </div>
    </motion.div>
  );
}