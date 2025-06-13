'use client';

import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_IMAGE_COMMAND } from '@/nodes/ImageNode';

export default function DragDropImagePlugin() {
  const [editor] = useLexicalComposerContext();
  const [active, setActive] = useState(false);

  useEffect(() => {
    const root = editor.getRootElement();
    if (!root) return;

    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes('Files')) {
        e.preventDefault();
        setActive(true);
      }
    };
    const onDragLeave = () => setActive(false);
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      setActive(false);
      const files = Array.from(e.dataTransfer?.files ?? []).filter((f) =>
        f.type.startsWith('image/')
      );
      files.forEach((f) => {
        const src = URL.createObjectURL(f);
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
          src,
          alt: f.name,
          width: 0,
          height: 0,
        });
      });
    };

    root.addEventListener('dragover', onDragOver);
    root.addEventListener('dragleave', onDragLeave);
    root.addEventListener('drop', onDrop);
    return () => {
      root.removeEventListener('dragover', onDragOver);
      root.removeEventListener('dragleave', onDragLeave);
      root.removeEventListener('drop', onDrop);
    };
  }, [editor]);

  if (!active) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center bg-zinc-900/50">
      <span className="rounded bg-white/80 px-6 py-4 text-lg font-medium text-zinc-800 shadow">
        Drop image to upload
      </span>
    </div>
  );
}