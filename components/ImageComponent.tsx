'use client'

import Image from 'next/image'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useSpring, animated } from 'react-spring'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { SET_IMAGE_HEIGHT_COMMAND } from '@/nodes/ImageNode'
import { useState, useRef, useEffect } from 'react'
import { IconPencil } from '@tabler/icons-react'
import ImageEditDialog from './ImageEditDialog'

interface Props {
  nodeKey: string
  src: string
  alt?: string
  width?: number
  height?: number
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
  } = useSortable({ id: nodeKey })

  const [editor] = useLexicalComposerContext()
  const [height, setHeight] = useState<number | undefined>(
    initialHeight ?? undefined
  )
  const [open, setOpen] = useState(false)
  const refFigure = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const startH = useRef(0)

  const style = useSpring({
    transform: CSS.Transform.toString(transform),
    config: { tension: 300, friction: 30 },
  })

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault()
    startY.current = e.clientY
    startH.current = refFigure.current?.offsetHeight ?? 0
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
  }

  const onPointerMove = (e: PointerEvent) => {
    const delta = e.clientY - startY.current
    const newH = Math.max(100, startH.current + delta)
    setHeight(newH)
  }

  const onPointerUp = () => {
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('pointerup', onPointerUp)
    const finalH = height ?? startH.current
    editor.dispatchCommand(SET_IMAGE_HEIGHT_COMMAND, {
      key: nodeKey,
      height: finalH,
    })
  }

  useEffect(() => {
    if (!refFigure.current) return
    const observer = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width
      if (width && initialHeight && !height) {
        const ratio = initialHeight / width
        setHeight(w * ratio)
      }
    })
    observer.observe(refFigure.current)
    return () => observer.disconnect()
  }, [width, initialHeight, height])

  return (
    <animated.figure
  style={{ ...style, transition, height: height ? `${height}px` : '200px' }}
  className="group relative my-4 w-full min-h-[200px] cursor-grab select-none overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
      {...attributes}
      {...listeners}
      data-lexical-key={nodeKey}>
      <Image
  src={src}
  alt={alt}
  width={width || 800}
  height={height || 600}
  className="h-full w-full object-contain z-0"
  unoptimized={src.startsWith('blob:')}
  draggable={false}
  priority
/>
      {alt && (
        <figcaption className="px-2 py-1 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {alt}
        </figcaption>
      )}
      <button
  onClick={() => setOpen(true)}
  className="absolute top-2 right-2 z-10 rounded bg-black/50 p-1 text-white opacity-0 transition group-hover:opacity-100 pointer-events-auto"
  aria-label="Edit image">
  <IconPencil size={16} />
</button>

      <span
        onPointerDown={onPointerDown}
        className="absolute bottom-1 right-1 z-10 h-4 w-4 cursor-ns-resize rounded bg-white/60 shadow ring-1 ring-zinc-400 dark:bg-zinc-800"
      />
    </animated.figure>
  )
}
