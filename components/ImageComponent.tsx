'use client';

import Image from 'next/image';

interface Props {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export default function ImageComponent({
  src,
  alt = '',
  width,
  height,
}: Props) {
  return (
    <figure className="my-4 w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 600}
        className="h-auto w-full object-contain"
        unoptimized={src.startsWith('blob:')}
        priority
      />
      {alt && (
        <figcaption className="px-2 py-1 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}