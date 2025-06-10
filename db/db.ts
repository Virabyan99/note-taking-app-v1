import { AppSettings, Note, noteSchema, settingsSchema } from '@/types/types';
import Dexie, { type Table } from 'dexie';


class LexicalDB extends Dexie {
  notes!: Table<Note>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super('LexicalMiniDB');
    this.version(1).stores({
      notes: 'id, updatedAt, title',
      settings: '',
    });
  }
}

export const db = new LexicalDB();

export async function safePutNote(note: unknown) {
  const parsed = noteSchema.parse(note);
  await db.notes.put(parsed);
}

export async function safeGetSettings(): Promise<AppSettings> {
  const raw = await db.settings.get('app');
  return settingsSchema.parse(raw ?? {});
}