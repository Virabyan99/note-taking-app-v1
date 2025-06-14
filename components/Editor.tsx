'use client';
import React, { createContext, useEffect, useState } from 'react';
import { LexicalEditor } from 'lexical';
import { useNoteStore } from '@/store';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ImageNode } from '@/nodes/ImageNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import ImagePlugin from './plugins/ImagePlugin';
import PasteImagePlugin from './plugins/PasteImagePlugin';
import DragDropImagePlugin from './plugins/DragDropImagePlugin';
import HorizontalSortPlugin from './plugins/HorizontalSortPlugin';
import VerticalSortPlugin from './plugins/VerticalSortPlugin';
import ImageResizePlugin from './plugins/ImageResizePlugin';
import ImageUpdatePlugin from './plugins/ImageUpdatePlugin';

export const DragContext = createContext<{
  isInternalDrag: boolean;
  setIsInternalDrag: (val: boolean) => void;
}>({
  isInternalDrag: false,
  setIsInternalDrag: () => {},
});

const emptyState = JSON.stringify({
  root: {
    children: [
      {
        type: 'paragraph',
        children: [{ type: 'text', text: '' }],
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
});

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

function EditorContent({ noteId }: EditorProps) {
  const note = useNoteStore((s) => s.notes.find((n) => n.id === noteId));
  const [editor] = useLexicalComposerContext();
  const [isInternalDrag, setIsInternalDrag] = useState(false);
  const setEditorInstance = useNoteStore((s) => s.setEditorInstance);
  const saveCurrentNote = useNoteStore((s) => s.saveCurrentNote);

  useEffect(() => {
    setEditorInstance(editor);
    const stateJson = note?.body || emptyState;
    const state = editor.parseEditorState(stateJson);
    queueMicrotask(() => {
      editor.setEditorState(state);
    });
    return () => {
      setEditorInstance(null);
    };
  }, [editor, note?.body, setEditorInstance]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveCurrentNote();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveCurrentNote]);

  if (!note) {
    return (
      <p className="text-center text-red-600">
        Note not found. Return to home.
      </p>
    );
  }

  return (
    <DragContext.Provider value={{ isInternalDrag, setIsInternalDrag }}>
      <div className="prose dark:prose-invert max-w-[90wv] border border-zinc-200 dark:border-zinc-700 rounded-md p-2">
        <PlainTextPlugin
          contentEditable={
            <ContentEditable
              className="min-h-[80vh] min-w-[90vw] outline-none whitespace-pre-wrap focus:ring-0 focus-visible:ring-0 lexical-editor"
            />
          }
          placeholder={
            <span className="text-zinc-400 select-none">Start typing…</span>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <ImagePlugin />
        <PasteImagePlugin />
        <DragDropImagePlugin />
        <HorizontalSortPlugin />
        <VerticalSortPlugin />
        <ImageResizePlugin />
        <ImageUpdatePlugin />
      </div>
    </DragContext.Provider>
  );
}

export default function Editor({ noteId }: EditorProps) {
  return (
    <LexicalComposer
      initialConfig={{ theme, namespace: 'lexical-mini', nodes: [ImageNode] }}
    >
      <EditorContent noteId={noteId} />
    </LexicalComposer>
  );
}