'use client';

import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSpring, animated } from 'react-spring';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { SET_IMAGE_HEIGHT_COMMAND } from '@/nodes/ImageNode';
import { useState, useRef, useEffect } from 'react';

interface Props {
  nodeKey: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function ImageComponent({
  nodeKey,
  src,
  alt = '',
  width,
  height: initialHeight,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: nodeKey });

  const [editor] = useLexicalComposerContext();
  const [height, setHeight] = useState<number | undefined>(initialHeight ?? undefined);
  const refFigure = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startH = useRef(0);

  const style = useSpring({
    transform: CSS.Transform.toString(transform),
    config: { tension: 300, friction: 30 },
  });

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    startY.current = e.clientY;
    startH.current = refFigure.current?.offsetHeight ?? 0;
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const onPointerMove = (e: PointerEvent) => {
    const delta = e.clientY - startY.current;
    const newH = Math.max(100, startH.current + delta);
    setHeight(newH);
  };

  const onPointerUp = () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    const finalH = height ?? startH.current;
    editor.dispatchCommand(SET_IMAGE_HEIGHT_COMMAND, { key: nodeKey, height: finalH });
  };

  useEffect(() => {
    if (!refFigure.current) return;
    const observer = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      if (width && initialHeight && !height) {
        const ratio = initialHeight / width;
        setHeight(w * ratio);
      }
    });
    observer.observe(refFigure.current);
    return () => observer.disconnect();
  }, [width, initialHeight, height]);

  return (
    <animated.figure
      ref={setNodeRef}
      style={{ ...style, transition, height: height ? `${height}px` : 'auto' }}
      className={`relative my-4 w-full cursor-grab select-none overflow-hidden rounded-lg border ${
        isDragging ? 'opacity-30 ring-2 ring-blue-500' : ''
      } border-zinc-200 dark:border-zinc-700`}
      {...attributes}
      {...listeners}
      data-lexical-key={nodeKey}
    >
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 600}
        className="h-full w-full object-contain"
        unoptimized={src.startsWith('blob:')}
        draggable={false}
        priority
      />
      {alt && (
        <figcaption className="px-2 py-1 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {alt}
        </figcaption>
      )}
      <span
        onPointerDown={onPointerDown}
        className="absolute bottom-1 right-1 h-4 w-4 cursor-ns-resize rounded bg-white/60 shadow ring-1 ring-zinc-400 dark:bg-zinc-800"
      />
    </animated.figure>
  );
}