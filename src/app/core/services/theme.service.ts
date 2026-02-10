import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    themeMode = signal<ThemeMode>((localStorage.getItem('theme') as ThemeMode) || 'system');

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
        root.classList.remove('light-mode', 'dark-mode');

        if (mode === 'light') {
            root.classList.add('light-mode');
        } else if (mode === 'dark') {
            root.classList.add('dark-mode');
        }
    }
}
