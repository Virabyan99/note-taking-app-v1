"use client";
import { useNoteStore } from '@/store';
import { Switch } from './ui/switch';

export default function Header() {
  const { settings, setSettings } = useNoteStore();
  const isDark = settings.theme === 'dark';

  const toggleTheme = () => {
    setSettings({ theme: isDark ? 'light' : 'dark' });
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
      <h1 className="text-xl font-bold">LexicalMini</h1>
      <div className="flex items-center gap-2">
        <Switch
          checked={isDark}
          onCheckedChange={toggleTheme}
          aria-label="Toggle dark mode"
        />
        <span className="text-sm text-zinc-700 dark:text-zinc-300">Dark Mode</span>
      </div>
    </header>
  );
}