'use client';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useMemo } from 'react';
import { $isImageNode } from '@/nodes/ImageNode';
import { $getRoot } from 'lexical';

export default function HorizontalSortPlugin() {
  const [editor] = useLexicalComposerContext();

  // Derive the order of image node keys
  const ids = useMemo(() => {
    let keys: string[] = [];
    editor.getEditorState().read(() => {
      const root = editor.getRootElement();
      root?.querySelectorAll('figure').forEach((el) => {
        const key = el.getAttribute('data-lexical-key');
        if (key) keys.push(key);
      });
    });
    return keys;
  }, [editor]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(active.id);
    const newIndex = ids.indexOf(over.id);
    const newOrder = arrayMove(ids, oldIndex, newIndex);

    // Persist the new order to Lexical
    editor.update(() => {
      const root = $getRoot();
      const nodes = editor.getEditorState()._nodeMap;
      const orderedNodes = newOrder
        .map((id) => nodes.get(id))
        .filter($isImageNode);

      // Remove all image nodes
      orderedNodes.forEach((node) => node.remove());

      // Append them in the new order at the end
      orderedNodes.forEach((node) => root.append(node));
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
        <></>
      </SortableContext>
    </DndContext>
  );
}