import type { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Table } from 'dexie';
import { AppSettings, Note } from '@/types/types';

export interface NoteState {
  notes: Note[];
  settings: AppSettings;
  createNote: (partial?: Partial<Note>) => Promise<Note>;
  updateNote: (id: string, draft: (n: Note) => void) => void;
  deleteNote: (id: string) => Promise<void>;
  setSettings: (s: Partial<AppSettings>) => void;
  rehydrate: (notes: Note[], settings: AppSettings) => void;
  _rehydrated: boolean;
}

export type NoteStoreCreator = StateCreator<NoteState, [['zustand/immer', never]], []>;

export function createNoteStoreCreator(db: { notes: Table<Note>; settings: Table<AppSettings, string> }): NoteStoreCreator {
  return (set, get) => ({
    notes: [],
    settings: { theme: 'light', fontSize: 16, fontFamily: 'system' },
    _rehydrated: false,

    async createNote(partial = {}) {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: 'Untitled',
        body: '',
        updatedAt: Date.now(),
        ...partial,
      };
      await db.notes.put(newNote);
      set(state => {
        state.notes.push(newNote);
      });
      return newNote;
    },

    updateNote(id, recipe) {
      set(state => {
        const note = state.notes.find(n => n.id === id);
        if (note) recipe(note);
      });
      const updated = get().notes.find(n => n.id === id);
      if (updated) db.notes.put(updated);
    },

    async deleteNote(id) {
      await db.notes.delete(id);
      set(state => {
        state.notes = state.notes.filter(n => n.id !== id);
      });
    },

    setSettings(patch) {
      set(state => {
        Object.assign(state.settings, patch);
      });
      db.settings.put(get().settings, 'app');
    },

    rehydrate(notes, settings) {
      set(state => {
        state.notes = notes;
        state.settings = settings;
        state._rehydrated = true;
      });
    },
  });
}