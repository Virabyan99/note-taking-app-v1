import { useCallback, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import { EditorState } from 'lexical';
import { useNoteStore } from '@/store';

export function useAutosave(noteId: string) {
  const { updateNote, setSaveState } = useNoteStore();
  const lastPersistPromise = useRef<Promise<void> | null>(null);

  const persist = useCallback(
    async (state: EditorState) => {
      setSaveState('saving');
      const serializedState = JSON.stringify(state.toJSON());
      const promise = updateNote(noteId, (d) => {
        d.body = serializedState;
        d.updatedAt = Date.now();
      });
      lastPersistPromise.current = promise;
      await promise;
      setSaveState('saved');
    },
    [noteId, updateNote, setSaveState]
  );

  const debouncedPersist = useCallback(
    debounce((state: EditorState) => {
      persist(state);
    }, 500),
    [persist]
  );

  const flush = useCallback(async () => {
    debouncedPersist.flush(); // Execute any pending debounced call
    if (lastPersistPromise.current) {
      await lastPersistPromise.current; // Wait for the database write to complete
    }
  }, [debouncedPersist]);

  useEffect(() => {
    return () => {
      debouncedPersist.flush();
    };
  }, [debouncedPersist]);

  return {
    onChange: debouncedPersist,
    flush,
  };
}