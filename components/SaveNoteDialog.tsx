'use client';

import { useState, useRef, useEffect } from 'react';
import { useNoteStore } from '@/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SaveNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SaveNoteDialog({ open, onOpenChange }: SaveNoteDialogProps) {
  const { notes, currentId, updateNote, closeCurrentNote } = useNoteStore();
  const currentNote = notes.find(n => n.id === currentId);
  const [title, setTitle] = useState(currentNote?.title || 'Untitled');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSave = async () => {
    if (title.trim() === '') {
      toast.error('Title cannot be empty');
      return;
    }
    if (currentId) {
      await updateNote(currentId, (note) => {
        note.title = title.trim();
      });
      await closeCurrentNote();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Note</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && title.trim() !== '') {
                handleSave();
              }
            }}
            placeholder="Enter note title"
          />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={title.trim() === ''}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}