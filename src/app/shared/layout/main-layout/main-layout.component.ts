import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Adicionado Router
import { ThemeService, ThemeMode } from '@core/services/theme.service';

// Angular Material
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider'; // 1. Importação necessária

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
    // 2. Adicionado MatDividerModule aqui
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
    private _router = inject(Router); // Injetado para o logout

    public expandedMenu = signal<string | null>(null);

    public navItems = [
        { label: 'Dashboard', route: '/dashboard', icon: 'lucideLayoutDashboard' },

        {
            label: 'Recursos Humanos',
            icon: 'lucideUsers',
            children: [
                { label: 'Pesquisa de Clima', route: '/rh/pesquisa-clima' },
                { label: 'Folha de Pagamento', route: '/rh/folha' },
                { label: 'Cargos e Salários', route: '/rh/cargos' },
            ],
        },

        {
            label: 'Logística e Frota',
            icon: 'lucideLayoutDashboard',
            children: [
                { label: 'Controle de Viagens', route: '/logistica/viagens' },
                { label: 'Manutenção Preventiva', route: '/logistica/manutencao' },
                { label: 'Abastecimento', route: '/logistica/combustivel' },
            ],
        },

        {
            label: 'Financeiro',
            icon: 'lucideUserCircle',
            children: [
                { label: 'Contas a Pagar', route: '/financeiro/pagar' },
                { label: 'Fluxo de Caixa', route: '/financeiro/caixa' },
            ],
        },

        { label: 'Configurações', route: '/settings', icon: 'lucideMonitor' },
    ];

    toggleMenu(label: string) {
        this.expandedMenu.set(this.expandedMenu() === label ? null : label);
    }

    setTheme(mode: ThemeMode) {
        this._themeService.setTheme(mode);
    }

    onLogout() {
        console.log('Finalizando sessão no Grupo Mônaco...');
        localStorage.removeItem('auth_token');
        this._router.navigate(['/login']);
    }
}
