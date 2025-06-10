'use client';

import { useEffect } from 'react';
import { useNoteStore } from '@/store';
import { db, safeGetSettings } from '@/db/db';
import { noteSchema } from '@/types/types';

export default function Providers({ children }: { children: React.ReactNode }) {
  const rehydrate = useNoteStore(state => state.rehydrate);

  // Rehydrate the store on mount
  useEffect(() => {
    (async () => {
      const notes = await db.notes.toArray();
      const safeNotes = notes.map(n => noteSchema.parse(n));
      const settings = await safeGetSettings();
      rehydrate(safeNotes, settings);
    })();
  }, [rehydrate]);

  // Subscribe to store changes for persistence
  useEffect(() => {
    const unsubscribe = useNoteStore.subscribe(
      state => [state.notes, state.settings] as const,
      async ([notes, settings]) => {
        await Promise.all([
          db.notes.bulkPut(notes),
          db.settings.put(settings, 'app'),
        ]);
      },
      { fireImmediately: false },
    );

    return () => unsubscribe();
  }, []);

  return children;
}