import { Injectable, signal, effect, OnDestroy } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
    themeMode = signal<ThemeMode>((localStorage.getItem('theme') as ThemeMode) || 'light');

    private mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    constructor() {
        effect(() => {
            const mode = this.themeMode();
            localStorage.setItem('theme', mode);
            this.applyTheme(mode);
        });

        this.mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
    }

    setTheme(mode: ThemeMode) {
        this.themeMode.set(mode);
    }

    private handleSystemThemeChange() {
        if (this.themeMode() === 'system') {
            this.applyTheme('system');
        }
    }

    private applyTheme(mode: ThemeMode) {
        const root = document.documentElement;

        root.classList.remove('dark');

        const isDark = mode === 'dark' || (mode === 'system' && this.mediaQuery.matches);

        if (isDark) {
            root.classList.add('dark');
        }
    }

    ngOnDestroy() {
        this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
    }
}
