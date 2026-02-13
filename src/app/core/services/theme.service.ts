import { Injectable, signal, effect, inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService implements OnDestroy {
    private _document = inject(DOCUMENT);
    private _overlay = inject(OverlayContainer);
    private _mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    public themeMode = signal<ThemeMode>((localStorage.getItem('theme') as ThemeMode) || 'system');

    public isDark = signal<boolean>(false);

    constructor() {
        effect(() => {
            const mode = this.themeMode();
            localStorage.setItem('theme', mode);
            this._updateThemeState();
        });

        this._mediaQuery.addEventListener('change', this._handleSystemChange.bind(this));
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

    ngOnDestroy(): void {
        this._mediaQuery.removeEventListener('change', this._handleSystemChange);
    }
}
