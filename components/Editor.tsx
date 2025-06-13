'use client'
import React, { useEffect } from 'react'
import { EditorState } from 'lexical'
import { useNoteStore } from '@/store'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { useAutosave } from '@/hooks/useAutosave'
import { ImageNode, INSERT_IMAGE_COMMAND } from '@/nodes/ImageNode'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { IconPhotoPlus } from '@tabler/icons-react'
import ImagePlugin from './plugins/ImagePlugin'
import PasteImagePlugin from './plugins/PasteImagePlugin'
import DragDropImagePlugin from './plugins/DragDropImagePlugin'
import HorizontalSortPlugin from './plugins/HorizontalSortPlugin'
import VerticalSortPlugin from './plugins/VerticalSortPlugin'
import ImageResizePlugin from './plugins/ImageResizePlugin'
import ImageUpdatePlugin from './plugins/ImageUpdatePlugin'

// Define an empty editor state for new notes with a default paragraph
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
})

export const theme = {
  paragraph: 'mb-2',
  text: {
    bold: 'font-semibold',
    italic: 'italic',
    underline: 'underline',
  },
}

interface EditorProps {
  noteId: string
}

function Toolbar() {
  const [editor] = useLexicalComposerContext()
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .forEach((f) => {
        const src = URL.createObjectURL(f)
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, alt: f.name })
      })
  }

  return (
    <div className="mb-2 flex items-center gap-2">
      <input
        type="file"
        accept="image/*"
        multiple
        hidden
        ref={inputRef}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        onClick={() => inputRef.current?.click()}
        className="rounded border px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800">
        <IconPhotoPlus size={16} className="inline mr-1" /> Image
      </button>
    </div>
  )
}

function EditorContent({ noteId }: EditorProps) {
  const note = useNoteStore((s) => s.notes.find((n) => n.id === noteId))
  const autosave = useAutosave(noteId)
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    const stateJson = note?.body || emptyState
    const state = editor.parseEditorState(stateJson)
    queueMicrotask(() => {
      editor.setEditorState(state)
    })
  }, [editor, note?.body])

  if (!note) {
    return (
      <p className="text-center text-red-600">
        Note not found. Return to home.
      </p>
    )
  }

  return (
  <>
    <Toolbar />
    <div className="prose dark:prose-invert max-w-none border border-zinc-200 dark:border-zinc-700 rounded-md p-4">
      <PlainTextPlugin
        contentEditable={
          <ContentEditable
            className="min-h-[60vh] outline-none whitespace-pre-wrap focus:ring-0 focus-visible:ring-0 lexical-editor"
          />
        }
        placeholder={
          <span className="text-zinc-400 select-none">Start typing…</span>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <HistoryPlugin />
      <OnChangePlugin onChange={autosave} />
      <ImagePlugin />
      <PasteImagePlugin />
      <DragDropImagePlugin />
      <HorizontalSortPlugin />
      <VerticalSortPlugin />
      <ImageResizePlugin />
      <ImageUpdatePlugin />
    </div>
  </>
);
}

export default function Editor({ noteId }: EditorProps) {
  return (
    <LexicalComposer
      initialConfig={{ theme, namespace: 'lexical-mini', nodes: [ImageNode] }}>
      <EditorContent noteId={noteId} />
    </LexicalComposer>
  )
}