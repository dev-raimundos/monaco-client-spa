import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService, ThemeMode } from '@core/services/theme.service';
import { AuthService } from '@core/services/auth.service';
import { NavItem, NavItemComponent } from '@shared/components/sidebar/nav-item.component';

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

    private readonly _fullNavigation: NavItem[] = [
        { label: 'Calendário', route: '/dashboard', icon: 'dashboard' },
        {
            label: 'RH',
            icon: 'group',
            service: 'humanresources',
            children: [
                {
                    label: 'Pesquisa de Clima',
                    service: 'prodeval',
                    children: [
                        {
                            label: 'Dashboard',
                            route: '/rh/folha/holerites',
                            service: 'prodeval.list',
                        },
                        {
                            label: '13º salário',
                            route: '/rh/folha/decimo',
                            service: 'prodeval.update',
                        },
                    ],
                },
                { label: 'Outros', route: '/rh/cargos', service: 'occupations.list' },
            ],
        },
    ];

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

        return filterItems(this._fullNavigation);
    });

    public displayName = computed(() => {
        const u = this.user();
        if (!u) return 'Usuário';
        const parts = u.name.trim().split(/\s+/);
        return parts.length > 1 ? `${parts[0]} ${parts[1]}` : parts[0];
    });

    public userInitials = computed(() => {
        const name = this.displayName();
        if (name === 'Usuário') return '??';
        const parts = name.split(' ');
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : name.substring(0, 2).toUpperCase();
    });

    public toggleProfileMenu() {
        this.isProfileMenuOpen.update((v) => !v);
    }

    setTheme(mode: ThemeMode) {
        this._themeService.setTheme(mode);
    }

    onLogout() {
        this._authService.logout();
    }

    isDarkMode = computed(() => {
        const mode = this.themeMode();
        if (mode === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return mode === 'dark';
    });
}
