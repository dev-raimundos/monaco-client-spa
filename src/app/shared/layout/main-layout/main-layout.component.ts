import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService, ThemeMode } from '@core/services/theme.service';
import { AuthService } from '@core/services/auth.service';
import { NavItem, NavItemComponent } from '@shared/components/sidebar/nav-item.component';
import { NAVIGATION } from '@core/config/navigation.config';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, NavItemComponent],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
    private _themeService = inject(ThemeService);
    private _authService = inject(AuthService);

    public isProfileMenuOpen = signal(false);
    public user = this._authService.user;
    public themeMode = this._themeService.themeMode;

    /**
     * Filtra a árvore de navegação baseada nos serviços (permissions) do usuário logado.
     * Retorna um Signal iterável para o template.
     */
    public navigation = computed(() => {
        const userServices = this.user()?.services || [];

        const filterItems = (items: NavItem[]): NavItem[] => {
            return items
                .filter((item) => !item.service || userServices.includes(item.service))
                .map((item) => ({
                    ...item,
                    children: item.children ? filterItems(item.children) : undefined,
                }))
                .filter((item) => (item.children && item.children.length > 0) || item.route);
        };

        return filterItems(NAVIGATION);
    });

    /**
     * Captura primeiro e segundo nome do usuário logado.
     */
    public displayName = computed(() => {
        const u = this.user();
        if (!u) return 'Usuário';

        // Filtra strings vazias resultantes do split caso haja espaços duplos
        const parts = u.name
            .trim()
            .split(/\s+/)
            .filter((p) => p.length > 0);

        if (parts.length > 1) {
            // Retorna Primeiro e Segundo nome
            return `${parts[0]} ${parts[1]}`;
        }
        return parts[0];
    });

    /**
     * Captura somente as letras iniciais do nome do usuário logado
     */
    public userInitials = computed(() => {
        const name = this.displayName();
        if (name === 'Usuário') return '??';
        const parts = name.split(' ');
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : name.substring(0, 2).toUpperCase();
    });

    /**
     * Abre ou fecha o menu de links
     */
    public toggleProfileMenu() {
        this.isProfileMenuOpen.update((v) => !v);
    }

    /**
     * Muda o tema do sismonaco
     * @param mode
     */
    setTheme(mode: ThemeMode) {
        this._themeService.setTheme(mode);
    }

    /**
     * Desloga o usuário
     */
    onLogout() {
        this._authService.logout();
    }

    /**
     * Estado do tema
     */
    isDarkMode = computed(() => {
        const mode = this.themeMode();
        if (mode === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return mode === 'dark';
    });
}
