'use client';

import Image from 'next/image';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSpring, animated } from 'react-spring';

interface Props {
  nodeKey: string; // Lexical node key
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
  height,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: nodeKey });

  const style = useSpring({
    transform: CSS.Transform.toString(transform),
    config: { tension: 300, friction: 30 },
  });

  return (
    <animated.figure
      ref={setNodeRef}
      style={{ ...style, transition }}
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
        className="h-auto w-full object-contain"
        unoptimized={src.startsWith('blob:')}
        draggable={false}
        priority
      />
      {alt && (
        <figcaption className="px-2 py-1 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {alt}
        </figcaption>
      )}
    </animated.figure>
  );
}