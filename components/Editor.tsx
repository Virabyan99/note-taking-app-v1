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

  const handleChange = useCallback(
    (state: EditorState) => {
      const text = state.toJSON().root?.children?.[0]?.textContent ?? '';
      if (text !== note.body) {
        updateNote(noteId, (d) => {
          d.body = text;
          d.updatedAt = Date.now();
        });
      }
    },
    [noteId, updateNote, note.body]
  );

  return (
    <LexicalComposer initialConfig={{ theme, namespace: 'lexical-mini' }}>
      <div className="prose dark:prose-invert max-w-none">
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
        <OnChangePlugin onChange={handleChange} />
      </div>
    </LexicalComposer>
  );
}