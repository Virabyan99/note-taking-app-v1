'use client';

import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $insertNodes, COMMAND_PRIORITY_EDITOR } from 'lexical'; // Import $insertNodes
import { INSERT_IMAGE_COMMAND, $createImageNode } from '@/nodes/ImageNode';

export default function ImagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const remove = editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        editor.update(() => {
          const imageNode = $createImageNode(payload);
          $insertNodes([imageNode], true); // Insert and select the node
        });
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
    return () => remove();
  }, [editor]);

  return null;
}