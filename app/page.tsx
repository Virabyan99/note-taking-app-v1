"use client";
import { useEffect, useState } from 'react';
import { useNoteStore } from '@/store';
import Editor from '@/components/Editor';
import { motion } from 'framer-motion';

export default function Home() {
  const { _rehydrated, createNote, setCurrent } = useNoteStore();
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto  px-2 sm:px-6 lg:px-8"
    >
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-2">
        {currentNoteId && (
          
            <Editor noteId={currentNoteId} />
          
        )}
      </div>
    </motion.div>
  );
}