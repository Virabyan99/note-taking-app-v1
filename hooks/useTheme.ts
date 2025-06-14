"use client";
import { useEffect } from 'react';
import { useNoteStore } from '@/store';
import { FONTS } from '@/utils/fonts';

export function useTheme() {
  const { settings } = useNoteStore();

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.setProperty('--font-body', FONTS[settings.fontFamily]);
    root.style.setProperty('--font-size', `${settings.fontSize}px`);
  }, [settings.theme, settings.fontFamily, settings.fontSize]);
}