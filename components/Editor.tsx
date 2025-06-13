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
import { ImageNode, $createImageNode } from '@/nodes/ImageNode';
import { $insertNodes } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { IconPhotoPlus } from '@tabler/icons-react';

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

function InsertImageButton() {
  const [editor] = useLexicalComposerContext();
  const addDemo = () => {
    editor.update(() => {
      $insertNodes([
        $createImageNode({
          src: 'https://placekitten.com/800/600',
          alt: 'Kitten',
          width: 800,
          height: 600,
        }),
      ]);
    });
  };
  return (
    <button
      onClick={addDemo}
      className="rounded border px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      <IconPhotoPlus size={16} className="inline mr-1" /> Image
    </button>
  );
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
    <LexicalComposer
      initialConfig={{ theme, namespace: 'lexical-mini', nodes: [ImageNode] }}
    >
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
      <div className="mt-2">
        <InsertImageButton />
      </div>
    </LexicalComposer>
  );
}