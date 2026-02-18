import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

interface DashboardStat {
    label: string;
    value: string | number;
    description: string;
    icon: string;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatDividerModule,
        MatListModule,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
    public stats: DashboardStat[] = [
        {
            label: 'Total de Respostas',
            value: 0,
            description: 'Respostas recebidas',
            icon: 'group',
        },
        {
            label: 'Pesquisas Ativas',
            value: 0,
            description: 'Pesquisas em andamento',
            icon: 'description',
        },
        {
            label: 'Total de Pesquisas',
            value: 0,
            description: 'Todas as pesquisas',
            icon: 'show_chart',
        },
        {
            label: 'Índice Médio',
            value: 'N/A',
            description: 'Clima organizacional',
            icon: 'bar_chart',
        },
    ];

    public quickActions = [
        { label: 'Criar Nova Pesquisa', icon: 'add' },
        { label: 'Ver Relatórios Detalhados', icon: 'list_alt' },
        { label: 'Gerenciar Pilares', icon: 'account_tree' },
        { label: 'Configurar Perguntas', icon: 'help_outline' },
    ];

    public recentActivity: unknown[] = [];

    onUpdate() {
        console.log('Atualizando dados...');
    }
}
