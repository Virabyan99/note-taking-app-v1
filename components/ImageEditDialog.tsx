'use client';

import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import Cropper from 'react-easy-crop';
import { useState, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { SET_IMAGE_SRC_COMMAND } from '@/nodes/ImageNode';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  src: string;
  nodeKey: string;
  alt?: string;
}

// Define the shape of the crop area object
interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ImageEditDialog({ open, onOpenChange, src, nodeKey, alt }: Props) {
  const [editor] = useLexicalComposerContext();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  // Specify that croppedAreaPixels can be Area or null
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [filter, setFilter] = useState<'none' | 'grayscale' | 'sepia' | 'contrast'>('none');

  // Use _ for unused croppedArea parameter and type croppedAreaPixels
  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    const image = await createImageBitmap(await fetch(src).then((r) => r.blob()));
    const canvas = document.createElement('canvas');
    canvas.width = croppedAreaPixels?.width ?? image.width;
    canvas.height = croppedAreaPixels?.height ?? image.height;
    const ctx = canvas.getContext('2d')!;
    switch (filter) {
      case 'grayscale':
        ctx.filter = 'grayscale(1)';
        break;
      case 'sepia':
        ctx.filter = 'sepia(1)';
        break;
      case 'contrast':
        ctx.filter = 'contrast(1.3)';
        break;
      default:
        ctx.filter = 'none';
    }
    ctx.drawImage(
      image,
      croppedAreaPixels?.x ?? 0,
      croppedAreaPixels?.y ?? 0,
      croppedAreaPixels?.width ?? image.width,
      croppedAreaPixels?.height ?? image.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        editor.dispatchCommand(SET_IMAGE_SRC_COMMAND, { key: nodeKey, src: url });
        onOpenChange(false);
      }
    }, 'image/png');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>Edit Image</DialogHeader>
        <div className="relative h-[60vh] bg-zinc-900">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={4 / 3}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            classes={{ containerClassName: 'cursor-crosshair' }}
          />
        </div>
        <div className="flex items-center gap-4">
          <label>Zoom</label>
          <Slider min={1} max={3} step={0.1} value={[zoom]} onValueChange={(v) => setZoom(v[0])} />
        </div>
        <div className="flex items-center gap-2">
          {(['none', 'grayscale', 'sepia', 'contrast'] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? 'default' : 'outline'}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}