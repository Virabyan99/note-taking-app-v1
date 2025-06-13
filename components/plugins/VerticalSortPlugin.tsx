'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useState } from 'react';
import { getImageNodeKeys } from '@/utils/lexicalHelpers';
import { $getRoot } from 'lexical';
import { $isImageNode } from '@/nodes/ImageNode';

export default function VerticalSortPlugin() {
  const [editor] = useLexicalComposerContext();
  const [ids, setIds] = useState<string[]>([]);

  // Sync image node keys when the editor state changes
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => {
        setIds(getImageNodeKeys());
      });
    });
  }, [editor]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
  );

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(ids, oldIndex, newIndex);

    editor.update(() => {
      const root = $getRoot();
      const nodes = editor.getEditorState()._nodeMap;
      const orderedNodes = newOrder
        .map((id) => nodes.get(id))
        .filter($isImageNode);

      // Remove existing image nodes
      orderedNodes.forEach((node) => node.remove());
      // Re-append in new order
      orderedNodes.forEach((node) => root.append(node));
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <></>
      </SortableContext>
    </DndContext>
  );
}