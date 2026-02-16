import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { PageEvent } from '@angular/material/paginator';
import { AppTableComponent } from '@shared/components/table/table-paginated.component';
import { TableColumn } from '@shared/models/table-config.model';
import { NotificationService } from '@core/services/notification.service';

@Component({
    selector: 'app-pillar-list',
    standalone: true,
    imports: [
        CommonModule,
        AppTableComponent,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        MatBadgeModule,
        MatTabsModule,
        MatProgressBarModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatExpansionModule,
        MatSelectModule,
        MatSliderModule,
    ],
    templateUrl: './material-demo.component.html',
})
export class DemoComponent implements OnInit {
    private readonly _notification = inject(NotificationService);

    // MOCK DATA: Lista estática para demonstração
    private readonly _MOCK_DATA = [
        {
            id: '1',
            title: 'Condições de Trabalho',
            description: 'Análise do ambiente físico e recursos.',
        },
        {
            id: '2',
            title: 'Imagem da Empresa',
            description: 'Nível de orgulho e reputação no mercado.',
        },
        {
            id: '3',
            title: 'Liderança',
            description: 'Apoio constante e escuta ativa dos gestores.',
        },
        {
            id: '4',
            title: 'Desenvolvimento',
            description: 'Oportunidades de carreira no Grupo Mônaco.',
        },
        { id: '5', title: 'Remuneração', description: 'Equilíbrio entre esforço e recompensa.' },
        {
            id: '6',
            title: 'Inovação',
            description: 'Capacidade de sugerir melhorias e novas ideias.',
        },
    ];

    public pillars = signal<any[]>([]);
    public total = signal(this._MOCK_DATA.length);
    public pageSize = signal(5);
    public currentPage = signal(1);

    public myColumns: TableColumn[] = [
        { key: 'title', label: 'Título do pilar' },
        { key: 'description', label: 'Descrição' },
    ];

    ngOnInit(): void {
        this.updateTable();
    }

    updateTable(): void {
        // Simulação de paginação local
        const start = (this.currentPage() - 1) * this.pageSize();
        const end = start + this.pageSize();
        this.pillars.set(this._MOCK_DATA.slice(start, end));
    }

    handlePage(event: PageEvent): any {
        this.currentPage.set(event.pageIndex + 1);
        this.pageSize.set(event.pageSize);
        this.updateTable();
    }

    showInfo() {
        this._notification.success('Padrão de UI SisMônaco V3 Ativo.');
    }

    openCreate() {
        this._notification.error('Ação bloqueada: Modo visualização apenas.');
    }
}
