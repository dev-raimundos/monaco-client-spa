import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

import { PillarService } from '../../data-access/pillar.service';
import { AppTableComponent } from '@shared/components/table/table-paginated.component';
import { TableColumn } from '@shared/models/table-config.model';
import { NotificationService } from '@core/services/notification.service';
import { Pillar, CreatePillarDto } from '../../models/pillars.model';
import { PillarFormComponent } from '../../ui/pillar-form/pillar-form.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
    selector: 'app-pillar-list',
    standalone: true,
    imports: [
        CommonModule,
        AppTableComponent,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        // Novos módulos para teste:
        MatCardModule,
        MatChipsModule,
        MatBadgeModule,
        MatTabsModule,
        MatProgressBarModule,
    ],
    templateUrl: './pillar-list.component.html',
})
export class PillarListComponent implements OnInit {
    private readonly _pillarService = inject(PillarService);
    private readonly _notification = inject(NotificationService);
    private readonly _dialog = inject(MatDialog);

    public pillars = this._pillarService.pillars;
    public isLoading = this._pillarService.loading;

    public total = signal(0);
    public pageSize = signal(5);
    public currentPage = signal(1);

    public myColumns: TableColumn[] = [
        { key: 'title', label: 'Título do pilar' },
        { key: 'description', label: 'Descrição' },
    ];

    ngOnInit(): void {
        this.fetchPillars();
    }

    fetchPillars(page: number = 1, size: number = this.pageSize()): void {
        this._pillarService.getPillarsPaginated(page, size).subscribe((res) => {
            this.total.set(res.total);
            this.pageSize.set(res.per_page);
            this.currentPage.set(res.current_page);
        });
    }

    handlePage(event: PageEvent) {
        this.fetchPillars(event.pageIndex + 1, event.pageSize);
    }

    /**
     * Implementação profissional do MatDialog
     */
    private _openDialog(pillar: Pillar | null = null): void {
        const dialogRef = this._dialog.open(PillarFormComponent, {
            width: '500px',
            disableClose: true, // Força o usuário a usar os botões do form
            data: { pillar }, // Passa os dados via MAT_DIALOG_DATA
        });

        // O segredo está aqui: o salvamento acontece e o modal retorna os dados
        dialogRef.afterClosed().subscribe((result: CreatePillarDto | null) => {
            if (result) {
                this._processSave(result, pillar);
            }
        });
    }

    private _processSave(data: CreatePillarDto, existingPillar: Pillar | null): void {
        const request = existingPillar
            ? this._pillarService.update(existingPillar.id, data)
            : this._pillarService.create(data);

        request.subscribe({
            next: () => {
                this._notification.success(`Pilar ${existingPillar ? 'atualizado' : 'criado'}!`);
                this.fetchPillars(this.currentPage());
            },
        });
    }

    openCreate() {
        this._openDialog();
    }

    onEdit(pillar: Pillar) {
        this._openDialog(pillar);
    }

    onDelete(id: string): void {
        // Alerta de Mentor: Evite o confirm() nativo.
        // Em produção, use um MatDialog para manter o tema Dark/Light.
        if (confirm('Deseja realmente excluir este pilar?')) {
            this._pillarService.delete(id).subscribe(() => {
                this._notification.success('Pilar removido.');
                this.fetchPillars(this.currentPage());
            });
        }
    }
}
