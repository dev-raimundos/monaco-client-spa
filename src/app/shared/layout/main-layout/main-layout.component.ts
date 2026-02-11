import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Core Services & Tokens
import { ThemeService, ThemeMode } from '@core/services/theme.service';
import { AuthService } from '@core/services/auth.service';
import { NAV_ITEMS_TOKEN } from '@shared/models/navigation.model';

// PrimeNG
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, MenuModule],
    templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
    private _themeService = inject(ThemeService);
    private _authService = inject(AuthService);

    // MANTIDA A LÓGICA DO TOKEN EXTERNO
    public readonly navItems = inject(NAV_ITEMS_TOKEN);

    public user = this._authService.user;
    public expandedMenu = signal<string | null>(null);

    // Menu do PrimeNG (OOP Style)
    public profileMenuItems = computed<MenuItem[]>(() => [
        { label: this.user()?.company || 'grupo mônaco', disabled: true },
        { label: 'tema claro', icon: 'light_mode', command: () => this.setTheme('light') },
        { label: 'tema escuro', icon: 'dark_mode', command: () => this.setTheme('dark') },
        { separator: true },
        {
            label: 'sair',
            icon: 'logout',
            command: () => this.onLogout(),
            styleClass: 'text-destructive',
        },
    ]);

    public displayName = computed(() => {
        const u = this.user();
        if (!u) return 'usuário';
        const parts = u.name.trim().split(/\s+/);
        return parts.length > 1 ? `${parts[0]} ${parts[1]}` : parts[0];
    });

    public userInitials = computed(() => {
        const name = this.displayName();
        if (name === 'usuário') return '??';
        const parts = name.split(' ');
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toLowerCase()
            : name.substring(0, 2).toLowerCase();
    });

    toggleMenu(label: string) {
        this.expandedMenu.set(this.expandedMenu() === label ? null : label);
    }

    setTheme(mode: ThemeMode) {
        this._themeService.setTheme(mode);
    }

    onLogout() {
        this._authService.logout();
    }
}
