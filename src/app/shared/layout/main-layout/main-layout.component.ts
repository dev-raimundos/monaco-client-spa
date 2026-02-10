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
            label: 'RH',
            icon: 'lucideUsers',
            children: [{ label: 'Pesquisa de Clima', route: '/rh/pesquisa-clima' }],
        },
    ];

    toggleMenu(label: string) {
        this.expandedMenu.set(this.expandedMenu() === label ? null : label);
    }

    setTheme(mode: ThemeMode) {
        this._themeService.setTheme(mode);
    }

    // 3. Implementação do método que estava faltando
    onLogout() {
        console.log('Finalizando sessão no Grupo Mônaco...');
        // Aqui futuramente você limpará o localStorage/Session
        localStorage.removeItem('auth_token');
        this._router.navigate(['/login']);
    }
}
