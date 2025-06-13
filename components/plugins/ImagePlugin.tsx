'use client';

import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes, COMMAND_PRIORITY_EDITOR } from 'lexical';
import { INSERT_IMAGE_COMMAND, $createImageNode } from '@/nodes/ImageNode';

export default function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const remove = editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const { src, alt } = payload;
        const img = new Image();
        img.src = src;
img.onload = () => {
  const width = img.naturalWidth;
  const height = img.naturalHeight;
  console.log('Image loaded:', { src, width, height });
  editor.update(() => {
    const imageNode = $createImageNode({ src, alt, width, height });
    $insertNodes([imageNode], true);
  });
};
        return true; // Command handled immediately
      },
      COMMAND_PRIORITY_EDITOR
    );
    return () => remove();
  }, [editor]);

  return null;
}