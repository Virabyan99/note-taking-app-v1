'use client';

import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_IMAGE_COMMAND } from '@/nodes/ImageNode';

export default function PasteImagePlugin() {
  const [editor] = useLexicalComposerContext();

  const handlePaste = (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (!file) continue;
        const src = URL.createObjectURL(file);
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, alt: file.name });
        e.preventDefault();
      }
    }
  };

  useEffect(() => {
    return editor.registerRootListener((rootElem, prev) => {
      if (prev) prev.removeEventListener('paste', handlePaste as any);
      if (rootElem) rootElem.addEventListener('paste', handlePaste as any);
    });
  }, [editor]);

  return null;
}