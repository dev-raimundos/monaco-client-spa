import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    themeMode = signal<ThemeMode>((localStorage.getItem('theme') as ThemeMode) || 'light');

    constructor() {
        effect(() => {
            const mode = this.themeMode();
            localStorage.setItem('theme', mode);
            this.applyTheme(mode);
        });
    }

    setTheme(mode: ThemeMode) {
        this.themeMode.set(mode);
    }

    private applyTheme(mode: ThemeMode) {
        const root = document.documentElement;

        root.classList.remove('dark');

        if (mode === 'dark') {
            root.classList.add('dark');
        } else if (mode === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) root.classList.add('dark');
        }
    }
}
