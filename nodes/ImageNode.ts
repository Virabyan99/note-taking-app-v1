import { DecoratorNode, SerializedLexicalNode } from 'lexical';
import React, { ReactNode } from 'react';
import ImageComponent from '@/components/ImageComponent';
import { createCommand } from 'lexical';

export const INSERT_IMAGE_COMMAND = createCommand<ImagePayload>('INSERT_IMAGE');
export const SET_IMAGE_HEIGHT_COMMAND = createCommand<{ key: string; height: number }>('SET_IMAGE_HEIGHT');
export const SET_IMAGE_SRC_COMMAND = createCommand<{ key: string; src: string }>('SET_IMAGE_SRC');

export interface ImagePayload {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export type SerializedImageNode = {
  type: 'image';
  version: 2;
  height?: number;
  src: string;
  alt?: string;
  width?: number;
} & SerializedLexicalNode;

export class ImageNode extends DecoratorNode<ReactNode> {
  __src: string;
  __alt: string;
  __width: number;
  __height: number;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__alt, node.__width, node.__height, node.getKey());
  }

  constructor(src: string, alt = '', width = 0, height = 0, key?: string) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__width = width;
    this.__height = height;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, alt, width, height } = serializedNode;
    return new ImageNode(src, alt, width, height);
  }

  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      version: 2,
      src: this.__src,
      alt: this.__alt,
      width: this.__width,
      height: this.__height,
    };
  }

  createDOM(): HTMLImageElement {
    const img = document.createElement('img');
    img.src = this.__src;
    img.alt = this.__alt;
    if (this.__width) img.width = this.__width;
    if (this.__height) img.height = this.__height;
    return img;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): ReactNode {
    return React.createElement(ImageComponent, {
      nodeKey: this.getKey(),
      src: this.__src,
      alt: this.__alt, // Corrected line
      width: this.__width,
      height: this.__height,
    });
  }

  setHeight(h: number) {
    const writable = this.getWritable();
    writable.__height = h;
  }

  setSrc(s: string) {
    const writable = this.getWritable();
    writable.__src = s;
  }
}

export function $createImageNode(payload: ImagePayload): ImageNode {
  const { src, alt, width, height } = payload;
  return new ImageNode(src, alt, width, height);
}

export function $isImageNode(node: unknown): node is ImageNode {
  return node instanceof ImageNode;
}