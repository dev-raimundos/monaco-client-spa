import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ThemeService, ThemeMode } from '@core/services/theme.service';
import { AuthService } from '@core/services/auth.service';

// Angular Material
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

// Icons
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
    // DI
    private _themeService = inject(ThemeService);
    private _authService = inject(AuthService);
    private _router = inject(Router);
    // Informações do usuário logado
    public user = this._authService.user;
    // Nome do menu que está aberto no sidebar
    public expandedMenu = signal<string | null>(null);

    public navItems = [
        // Dashboard
        { label: 'dashboard', route: '/dashboard', icon: 'lucideLayoutDashboard' },
        // Recursos humanos
        {
            label: 'recursos humanos',
            icon: 'lucideUsers',
            children: [
                { label: 'pesquisa de clima', route: '/rh/pesquisa-clima' },
                { label: 'folha de pagamento', route: '/rh/folha' },
                { label: 'cargos e salários', route: '/rh/cargos' },
            ],
        },
        // Logística e frota
        {
            label: 'logística e frota',
            icon: 'lucideLayoutDashboard',
            children: [
                { label: 'controle de viagens', route: '/logistica/viagens' },
                { label: 'manutenção preventiva', route: '/logistica/manutencao' },
                { label: 'abastecimento', route: '/logistica/combustivel' },
            ],
        },
        // Financeiro
        {
            label: 'financeiro',
            icon: 'lucideUserCircle',
            children: [
                { label: 'contas a pagar', route: '/financeiro/pagar' },
                { label: 'fluxo de caixa', route: '/financeiro/caixa' },
            ],
        },
        // Configurações
        { label: 'configurações', route: '/settings', icon: 'lucideMonitor' },
    ];

    // Computa as iniciais do nome do Usuário
    public userInitials = computed(() => {
        const name = this.user()?.name || '';
        if (!name) return '??';
        const parts = name.split(' ');
        if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toLowerCase();
        }
        return name.substring(0, 2).toLowerCase();
    });

    // Exibe apenas o primeiro e segundo nome do usuário
    public displayName = computed(() => {
        const fullName = this.user()?.name;
        if (!fullName) return 'usuário';
        const parts = fullName.trim().split(/\s+/);
        return parts.length > 1 ? `${parts[0]} ${parts[1]}` : parts[0];
    });

    /**
     * Método para abrir o menu de navegação
     * @param label
     */
    toggleMenu(label: string) {
        this.expandedMenu.set(this.expandedMenu() === label ? null : label);
    }

    /**
     * Método pra alternar entre tema claro ou escuro
     * @param mode
     */
    setTheme(mode: ThemeMode) {
        this._themeService.setTheme(mode);
    }

    onLogout() {
        this._authService.logout();
    }
}
