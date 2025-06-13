'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { SET_IMAGE_SRC_COMMAND, $isImageNode } from '@/nodes/ImageNode';
import { useEffect } from 'react';

export default function ImageUpdatePlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      SET_IMAGE_SRC_COMMAND,
      ({ key, src }) => {
        editor.update(() => {
          const node = editor.getEditorState()._nodeMap.get(key);
          if ($isImageNode(node)) {
            node.setSrc(src);
          }
        });
        return true;
      },
      0
    );
  }, [editor]);
  return null;
}