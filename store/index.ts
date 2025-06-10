import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { db } from '@/db/db';
import type { NoteState } from './useNoteStore';
import { createNoteStoreCreator } from './useNoteStore';

export const useNoteStore = create<NoteState>()(immer(createNoteStoreCreator(db)));