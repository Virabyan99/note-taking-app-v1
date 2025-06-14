'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useNoteStore } from '@/store';
import { IconSettings } from '@tabler/icons-react';
import { FONTS } from '@/utils/fonts';

export default function SettingsDialog() {
  const [open, setOpen] = useState(false);
  const { settings, setSettings } = useNoteStore();
  const [font, setFont] = useState(settings.fontFamily ?? 'system');
  const [size, setSize] = useState(settings.fontSize ?? 16);

  // Live apply font settings when dialog is open
  useEffect(() => {
    if (open) {
      document.documentElement.style.setProperty('--font-body', FONTS[font]);
      document.documentElement.style.setProperty('--font-size', `${size}px`);
    }
  }, [font, size, open]);

  // Reset font settings when dialog closes
  useEffect(() => {
    if (!open) {
      document.documentElement.style.setProperty('--font-body', FONTS[settings.fontFamily]);
      document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);
    }
  }, [open, settings.fontFamily, settings.fontSize]);

  const handleSave = () => {
    setSettings({ fontFamily: font, fontSize: size });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <IconSettings size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Appearance</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Font family */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Font family</label>
            <Select value={font} onValueChange={(v) => setFont(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="System" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="serif">Serif</SelectItem>
                <SelectItem value="mono">Mono</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Font size */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Base font size ({size}px)
            </label>
            <Slider
              min={12}
              max={20}
              step={1}
              value={[size]}
              onValueChange={(v) => setSize(v[0])}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}