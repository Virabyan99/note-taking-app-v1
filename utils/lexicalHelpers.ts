import { $getRoot } from 'lexical';
import { $isImageNode } from '@/nodes/ImageNode';

export function getImageNodeKeys(): string[] {
  const keys: string[] = [];
  $getRoot().getChildren().forEach((node) => {
    if ($isImageNode(node)) {
      keys.push(node.getKey());
    }
  });
  return keys;
}

export function extractTextFromEditorState(editorState: string): string {
  // Return empty string if editorState is falsy (e.g., empty string or null)
  if (!editorState) {
    return '';
  }
  try {
    const state = JSON.parse(editorState);
    const root = state.root;
    let text = '';
    function traverse(node: any) {
      if (node.type === 'text' && node.text) {
        text += node.text + ' ';
      } else if (node.children) {
        node.children.forEach(traverse);
      }
    }
    traverse(root);
    return text.trim();
  } catch (e) {
    console.error('Failed to parse editor state:', e);
    return '';
  }
}