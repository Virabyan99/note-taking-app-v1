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