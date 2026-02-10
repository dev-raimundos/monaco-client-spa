import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

// Spartan UI - Importações das suas libs/ui
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmAvatar, HlmAvatarFallback } from '@spartan-ng/helm/avatar';

// Ng Icons Core - ISSO É O QUE FALTA PARA O [name] FUNCIONAR
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
    lucideLayoutDashboard,
    lucideUsers,
    lucideTruck,
    lucideSettings,
    lucideChevronDown,
    lucideLogOut,
} from '@ng-icons/lucide';

interface NavItem {
    label: string;
    icon: string;
    route?: string;
    children?: { label: string; route: string }[];
}

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        HlmIcon, // Fornece o estilo hlm
        NgIcon, // FORNECE A PROPRIEDADE [name] E O SELETOR
        HlmButton,
        HlmAvatar,
        HlmAvatarFallback,
    ],
    providers: [
        provideIcons({
            lucideLayoutDashboard,
            lucideUsers,
            lucideTruck,
            lucideSettings,
            lucideChevronDown,
            lucideLogOut,
        }),
    ],
    templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
    expandedMenu = signal<string | null>(null);

    navItems: NavItem[] = [
        { label: 'Dashboard', icon: 'lucideLayoutDashboard', route: '/dashboard' },
        {
            label: 'Usuários',
            icon: 'lucideUsers',
            children: [
                { label: 'Listagem', route: '/usuarios' },
                { label: 'Permissões', route: '/usuarios/permissoes' },
                { label: 'Grupos', route: '/usuarios/grupos' },
            ],
        },
        {
            label: 'Logística',
            icon: 'lucideTruck',
            children: [
                { label: 'Veículos', route: '/logistica/veiculos' },
                { label: 'Transportes', route: '/logistica/transportes' },
            ],
        },
        { label: 'Configurações', icon: 'lucideSettings', route: '/config' },
    ];

    toggleMenu(label: string) {
        this.expandedMenu.update((current) => (current === label ? null : label));
    }
}
