import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  expanded?: boolean;
  children?: { label: string; route: string }[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  expandedMenu = signal<string | null>(null);

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/dashboard' },
    {
      label: 'Usuários',
      icon: 'pi pi-users',
      children: [
        { label: 'Listagem', route: '/usuarios' },
        { label: 'Permissões', route: '/usuarios/permissoes' },
        { label: 'Grupos', route: '/usuarios/grupos' },
      ],
    },
    {
      label: 'Logística',
      icon: 'pi pi-truck',
      children: [
        { label: 'Veículos', route: '/logistica/veiculos' },
        { label: 'Transportes', route: '/logistica/transportes' },
      ],
    },
    { label: 'Configurações', icon: 'pi pi-cog', route: '/config' },
  ];

  toggleMenu(label: string) {
    this.expandedMenu.update((current) => (current === label ? null : label));
  }
}
