import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService, ThemeMode } from '@core/services/theme.service';
import { AuthService } from '@core/services/auth.service';
import { NavItem, NavItemComponent } from '@shared/components/sidebar/nav-item';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, NavItemComponent],
    templateUrl: './main-layout.html',
    styleUrl: './main-layout.css',
})
export class MainLayoutComponent {
    private _themeService = inject(ThemeService);
    private _authService = inject(AuthService);

    public isProfileMenuOpen = signal(false);
    public user = this._authService.user;

    public readonly navigation: NavItem[] = [
        { label: 'dashboard', route: '/dashboard', icon: 'dashboard' },
        {
            label: 'recursos humanos',
            icon: 'group',
            children: [
                { label: 'pesquisa de clima', route: '/rh/pesquisa-clima' },
                {
                    label: 'folha de pagamento',
                    children: [
                        { label: 'holerites', route: '/rh/folha/holerites' },
                        { label: '13º salário', route: '/rh/folha/decimo' },
                    ],
                },
                { label: 'cargos e salários', route: '/rh/cargos' },
            ],
        },
        {
            label: 'logística e frota',
            icon: 'local_shipping',
            children: [
                { label: 'controle de viagens', route: '/logistica/viagens' },
                { label: 'manutenção preventiva', route: '/logistica/manutencao' },
                { label: 'abastecimento', route: '/logistica/combustivel' },
            ],
        },
        {
            label: 'financeiro',
            icon: 'account_balance_wallet',
            children: [
                { label: 'contas a pagar', route: '/financeiro/pagar' },
                { label: 'fluxo de caixa', route: '/financeiro/caixa' },
            ],
        },
        { label: 'configurações', route: '/settings', icon: 'settings' },
    ];

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
}
