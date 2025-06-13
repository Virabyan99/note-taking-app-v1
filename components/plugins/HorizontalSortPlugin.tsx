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
import { useMemo, useContext } from 'react';
import { $isImageNode } from '@/nodes/ImageNode';
import { $getRoot } from 'lexical';
import { DragContext } from '../Editor'; // Adjust path as needed

export default function HorizontalSortPlugin() {
  const [editor] = useLexicalComposerContext();
  const { setIsInternalDrag } = useContext(DragContext);

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

    editor.update(() => {
      const root = $getRoot();
      const nodes = editor.getEditorState()._nodeMap;
      const orderedNodes = newOrder
        .map((id) => nodes.get(id))
        .filter($isImageNode);

      orderedNodes.forEach((node) => node.remove());
      orderedNodes.forEach((node) => root.append(node));
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToHorizontalAxis]}
      onDragStart={() => setIsInternalDrag(true)}
      onDragEnd={(event) => {
        setIsInternalDrag(false);
        handleDragEnd(event);
      }}
    >
      <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
        <></>
      </SortableContext>
    </DndContext>
  );
}