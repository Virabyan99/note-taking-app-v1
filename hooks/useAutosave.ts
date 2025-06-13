import { useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { EditorState } from 'lexical';
import { useNoteStore } from '@/store';

export function useAutosave(noteId: string) {
  const { updateNote, setSaveState } = useNoteStore();

  const persist = useCallback(
    (state: EditorState) => {
      setSaveState('saving');
      const serializedState = JSON.stringify(state.toJSON());
      updateNote(noteId, (d) => {
        d.body = serializedState;
        d.updatedAt = Date.now();
      });
      setSaveState('saved');
    },
    [noteId, updateNote, setSaveState]
  );

  const debouncedPersist = useCallback(debounce(persist, 500), [persist]);

  useEffect(() => {
    return () => {
      debouncedPersist.flush();
    };
  }, [debouncedPersist]);

  return debouncedPersist;
}