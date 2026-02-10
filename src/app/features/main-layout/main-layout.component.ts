import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { HlmButton } from '@shared/spartan/button/src/index';
import { HlmAvatar, HlmAvatarFallback } from '@shared/spartan/avatar/src/index';
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
        NgIcon,
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
