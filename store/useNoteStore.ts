import type { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Table } from 'dexie';
import { AppSettings, Note } from '@/types/types';
import { LexicalEditor } from 'lexical';
import { FONTS } from '@/utils/fonts';

export interface NoteState {
  notes: Note[];
  settings: AppSettings;
  editorInstance: LexicalEditor | null;
  createNote: (partial?: Partial<Note>) => Promise<Note>;
  updateNote: (id: string, draft: (n: Note) => void) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  deleteAllNotes: () => Promise<void>;
  setSettings: (s: Partial<AppSettings>) => void;
  rehydrate: (notes: Note[], settings: AppSettings) => void;
  _rehydrated: boolean;
  currentId: string | null;
  setCurrent: (id: string | null) => void;
  saveState: 'idle' | 'saving' | 'saved';
  setSaveState: (state: 'idle' | 'saving' | 'saved') => void;
  setEditorInstance: (editor: LexicalEditor | null) => void;
  closeCurrentNote: () => Promise<void>;
  saveCurrentNote: () => Promise<void>;
}

export function createNoteStoreCreator(db: { notes: Table<Note>; settings: Table<AppSettings, string> }): NoteStoreCreator {
  return (set, get) => ({
    notes: [],
    settings: { theme: 'light', fontSize: 16, fontFamily: 'system' },
    editorInstance: null,
    _rehydrated: false,
    currentId: null,
    saveState: 'idle',
    setSaveState: (state) => set({ saveState: state }),

    async createNote(partial = {}) {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: 'Untitled',
        body: '',
        updatedAt: Date.now(),
        ...partial,
      };
      await db.notes.put(newNote);
      set((state) => {
        state.notes.push(newNote);
      });
      return newNote;
    },

    async updateNote(id, recipe) {
      set((state) => {
        const note = state.notes.find((n) => n.id === id);
        if (note) recipe(note);
      });
      const updated = get().notes.find((n) => n.id === id);
      if (updated) {
        await db.notes.put(updated);
      }
    },

    async deleteNote(id) {
      await db.notes.delete(id);
      set((state) => {
        state.notes = state.notes.filter((n) => n.id !== id);
        if (state.currentId === id) {
          state.currentId = null;
        }
      });
      const state = get();
      if (!state.currentId && state.notes.length > 0) {
        state.setCurrent(state.notes[0].id);
      } else if (state.notes.length === 0) {
        const newNote = await state.createNote();
        state.setCurrent(newNote.id);
      }
    },

    async deleteAllNotes() {
      await db.notes.clear();
      set((state) => {
        state.notes = [];
        state.currentId = null;
      });
      const state = get();
      const newNote = await state.createNote();
      state.setCurrent(newNote.id);
    },

    setSettings(patch) {
      set((state) => {
        Object.assign(state.settings, patch);
      });
      const { settings } = get();
      db.settings.put(settings, 'app');
      localStorage.setItem('lexical-mini-theme', settings.theme);
      localStorage.setItem('lexical-mini-font', FONTS[settings.fontFamily]);
      localStorage.setItem('lexical-mini-size', settings.fontSize.toString());
    },

    rehydrate(notes, settings) {
      set((state) => {
        state.notes = notes;
        state.settings = settings;
        state._rehydrated = true;
      });
    },

    setCurrent(id) {
      set((state) => {
        state.currentId = id;
      });
    },

    setEditorInstance(editor) {
      set({ editorInstance: editor });
    },

    saveCurrentNote: async () => {
      const state = get();
      if (state.currentId && state.editorInstance) {
        const editorState = state.editorInstance.getEditorState();
        const serializedState = JSON.stringify(editorState.toJSON());
        await state.updateNote(state.currentId, (note) => {
          note.body = serializedState;
          note.updatedAt = Date.now();
        });
      }
    },

    async closeCurrentNote() {
      const state = get();
      await state.saveCurrentNote();
      const newNote = await state.createNote();
      state.setCurrent(newNote.id);
    },
  });
}