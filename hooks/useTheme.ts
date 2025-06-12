"use client";
import { useEffect } from 'react';
import { useNoteStore } from '@/store';

export function useTheme() {
  const theme = useNoteStore(s => s.settings.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);
}