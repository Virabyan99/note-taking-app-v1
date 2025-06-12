'use client';
import { useCallback } from 'react';
import { EditorState } from 'lexical';
import { useNoteStore } from '@/store';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useAutosave } from '@/hooks/useAutosave';

export const theme = {
  paragraph: 'mb-2',
  text: {
    bold: 'font-semibold',
    italic: 'italic',
    underline: 'underline',
  },
};

interface EditorProps {
  noteId: string;
}

export default function Editor({ noteId }: EditorProps) {
  const note = useNoteStore((s) => s.notes.find((n) => n.id === noteId));
  const updateNote = useNoteStore((s) => s.updateNote);
  const autosave = useAutosave(noteId);

  if (!note) {
    return (
      <p className="text-center text-red-600">
        Note not found. Return to home.
      </p>
    );
  }

  const initialState = useCallback(
    (editor: unknown) => {
      (editor as any).update(() => {
        const root = (editor as any).getRootElement?.() ?? null;
        if (root) root.innerText = note.body;
      });
    },
    [note.body]
  );

  return (
    <LexicalComposer initialConfig={{ theme, namespace: 'lexical-mini' }}>
      <div className="prose dark:prose-invert max-w-none border border-zinc-200 dark:border-zinc-700 rounded-md p-4">
        <PlainTextPlugin
          contentEditable={
            <ContentEditable
              className="min-h-[60vh] outline-none whitespace-pre-wrap focus:ring-0 focus-visible:ring-0"
            />
          }
          placeholder={
            <span className="text-zinc-400 select-none">Start typing…</span>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin onChange={autosave} />
      </div>
    </LexicalComposer>
  );
}