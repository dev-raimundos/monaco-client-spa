import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService, ThemeMode } from '@core/services/theme.service';
import { AuthService } from '@core/services/auth.service';
import { NAV_ITEMS_TOKEN } from '@shared/models/navigation.model';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideChevronDown,
    lucideLogOut,
    lucideSun,
    lucideMoon,
    lucideMonitor,
    lucideLayoutDashboard,
    lucideUsers,
    lucideUserCircle,
} from '@ng-icons/lucide';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, MatMenuModule, MatButtonModule, MatDividerModule, NgIcon],
    providers: [
        provideIcons({
            lucideChevronDown,
            lucideLogOut,
            lucideSun,
            lucideMoon,
            lucideMonitor,
            lucideLayoutDashboard,
            lucideUsers,
            lucideUserCircle,
        }),
    ],
    templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
    private _themeService = inject(ThemeService);
    private _authService = inject(AuthService);

    public readonly navItems = inject(NAV_ITEMS_TOKEN);

    public user = this._authService.user;
    public expandedMenu = signal<string | null>(null);

    /**
     * Exibe apenas o primeiro e segundo nome do usuário logado
     */
    public displayName = computed(() => {
        const u = this.user();
        if (!u) return 'usuário';
        const parts = u.name.trim().split(/\s+/);
        return parts.length > 1 ? `${parts[0]} ${parts[1]}` : parts[0];
    });

    /**
     * Exibe as iniciais do primeiro e segundo nome do usuário logado
     */
    public userInitials = computed(() => {
        const name = this.displayName();
        if (name === 'usuário') return '??';
        const parts = name.split(' ');
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toLowerCase()
            : name.substring(0, 2).toLowerCase();
    });

    /**
     * Abre ou fecha o menu de navegação
     * @param label
     */
    toggleMenu(label: string) {
        this.expandedMenu.set(this.expandedMenu() === label ? null : label);
    }

    /**
     * Muda o tema do sistema
     * @param mode
     */
    setTheme(mode: ThemeMode) {
        this._themeService.setTheme(mode);
    }

    /**
     * Fecha a sessão do usuário
     */
    onLogout() {
        this._authService.logout();
    }
}
