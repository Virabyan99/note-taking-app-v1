'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { SET_IMAGE_HEIGHT_COMMAND, $isImageNode } from '@/nodes/ImageNode';
import { useEffect } from 'react';
import { COMMAND_PRIORITY_HIGH } from 'lexical';

export default function ImageResizePlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      SET_IMAGE_HEIGHT_COMMAND,
      ({ key, height }) => {
        editor.update(() => {
          const node = editor.getEditorState()._nodeMap.get(key);
          if ($isImageNode(node)) {
            node.setHeight(height);
          }
        });
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor]);
  return null;
}