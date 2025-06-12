"use client";
import { useTheme } from '@/hooks/useTheme';
import { ReactNode } from 'react';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  useTheme();
  return <>{children}</>;
}