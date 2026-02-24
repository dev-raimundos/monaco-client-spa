import { Injectable, signal, effect, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DestroyRef } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private readonly _document = inject(DOCUMENT);
    private readonly _overlay = inject(OverlayContainer);
    private readonly _destroyRef = inject(DestroyRef);
    private readonly _mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    public readonly themeMode = signal<ThemeMode>((localStorage.getItem('theme') as ThemeMode) ?? 'system');

    public readonly isDark = signal<boolean>(false);

    constructor() {
        effect(() => {
            const mode = this.themeMode();
            localStorage.setItem('theme', mode);
            this._updateThemeState();
        });

        const handler = this._handleSystemChange.bind(this);
        this._mediaQuery.addEventListener('change', handler);

        this._destroyRef.onDestroy(() => {
            this._mediaQuery.removeEventListener('change', handler);
        });
    }

    public setTheme(mode: ThemeMode): void {
        this.themeMode.set(mode);
    }

    private _handleSystemChange(): void {
        if (this.themeMode() === 'system') {
            this._updateThemeState();
        }
    }

    private _updateThemeState(): void {
        const mode = this.themeMode();
        const prefersDark = this._mediaQuery.matches;
        const shouldBeDark = mode === 'dark' || (mode === 'system' && prefersDark);

        this.isDark.set(shouldBeDark);
        this._applyThemeClasses(shouldBeDark);
    }

    private _applyThemeClasses(isDark: boolean): void {
        const root = this._document.documentElement;
        const overlayContainer = this._overlay.getContainerElement();

        if (isDark) {
            root.classList.add('dark');
            overlayContainer.classList.add('dark');
        } else {
            root.classList.remove('dark');
            overlayContainer.classList.remove('dark');
        }
    }
}
