import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Core & Shared
import { PillarService } from '../../data-access/pillar.service';
import { AppTableComponent } from '@shared/components/table/table-paginated.component';
import { TableColumn } from '@shared/models/table-config.model';

// PrimeNG Stack
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';

@Component({
    selector: 'app-pillar-list',
    standalone: true,
    imports: [CommonModule, AppTableComponent, ProgressSpinnerModule, ButtonModule],
    templateUrl: './pillar-list.component.html',
})
export class PillarListComponent implements OnInit {
    private readonly _pillarService = inject(PillarService);

    public pillars = this._pillarService.pillars;
    public isLoading = this._pillarService.loading;

    public total = signal(0);
    public pageSize = signal(15);
    public currentPage = signal(1);

    public myColumns: TableColumn[] = [
        { key: 'title', label: 'Título do Pilar' },
        { key: 'description', label: 'Descrição' },
    ];

    ngOnInit(): void {
        this.fetchPillars();
    }

    fetchPillars(page: number = 1, size: number = 5): void {
        this._pillarService.getPillarsPaginated(page, size).subscribe((res) => {
            this.total.set(res.total);
            this.pageSize.set(res.per_page);
            this.currentPage.set(res.current_page);
        });
    }

    /**
     * Adaptado para o PaginatorState do PrimeNG
     */
    handlePage(event: PaginatorState) {
        // PrimeNG 'page' é 0-indexed, somamos 1 para a nossa API
        const pageToFetch = (event.page ?? 0) + 1;
        this.fetchPillars(pageToFetch, event.rows ?? 5);
    }

    onDelete(id: string): void {
        // Implementação do diálogo de confirmação virá a seguir para evitar o 'confirm' nativo
        if (confirm('Deseja excluir este pilar?')) {
            this._pillarService.delete(id).subscribe(() => this.fetchPillars(this.currentPage()));
        }
    }

    onEdit(id: string): void {
        console.log('Edit', id);
    }
}
