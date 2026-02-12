import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { ThemeService, ThemeMode } from '@core/services/theme.service';
import { AuthService } from '@core/services/auth.service';
import { NavItem, NavItemComponent } from '@shared/components/sidebar/nav-item.component';
import { NAVIGATION } from '@core/config/navigation.config';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        NavItemComponent,
        MatIconModule,
        MatButtonModule,
        MatRippleModule,
    ],
    templateUrl: './main-layout.component.html',
    styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {
    private _themeService = inject(ThemeService);
    private _authService = inject(AuthService);

    public isProfileMenuOpen = signal(false);
    public user = this._authService.user;
    public themeMode = this._themeService.themeMode;

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
        const parts = u.name.trim().split(/\s+/);
        return parts.length > 1 ? `${parts[0]} ${parts[1]}` : parts[0];
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
    public setTheme(mode: ThemeMode) {
        this._themeService.setTheme(mode);
    }

    /**
     * Desloga o usuário
     */
    public onLogout() {
        this._authService.logout();
    }
}
