import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PillarService } from '../../data-access/pillar.service';
import { AppTableComponent } from '@shared/components/table/table.component';
import { TableColumn } from '@shared/models/table-config.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-pillar-list',
    standalone: true,
    imports: [
        CommonModule,
        AppTableComponent,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatIconModule,
    ],
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

    handlePage(event: PageEvent) {
        this.fetchPillars(event.pageIndex + 1, event.pageSize);
    }

    onDelete(id: string): void {
        if (confirm('Deseja excluir este pilar?')) {
            this._pillarService.delete(id).subscribe(() => this.fetchPillars(this.currentPage()));
        }
    }

    onEdit(id: string): void {
        console.log('Edit', id);
    }
}
