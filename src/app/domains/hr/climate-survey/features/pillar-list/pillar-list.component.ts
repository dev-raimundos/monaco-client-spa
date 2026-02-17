import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';

import { PillarService } from '../../data-access/pillar.service';
import { AppTableComponent } from '@shared/components/table/table-paginated.component';
import { PillarFormComponent } from '../../ui/pillar-form/pillar-form.component';
import { ConfirmDialogComponent } from '@shared/components/dialog/confirm-dialog.component';
import { Pillar } from '../../models/pillars.model';
import { TableColumn } from '@shared/models/table-config.model';

@Component({
    selector: 'app-pillar-list',
    standalone: true,
    imports: [CommonModule, AppTableComponent, MatButtonModule, MatIconModule, MatDialogModule],
    templateUrl: './pillar-list.component.html',
})
export class PillarListComponent implements OnInit {
    protected readonly pillarService = inject(PillarService);
    private readonly dialog = inject(MatDialog);

    readonly columns: TableColumn[] = [
        { key: 'title', label: 'Título' },
        { key: 'description', label: 'Descrição' },
    ];

    totalItems = signal(0);
    pageSize = signal(5);
    currentPage = signal(1);

    /**
     * Lógica executada no nascimento do componente
     */
    ngOnInit(): void {
        this.loadData();
    }

    /**
     * Carrega os dados de fm_pillars
     */
    loadData(): void {
        this.pillarService
            .getPillarsPaginated(this.currentPage(), this.pageSize())
            .subscribe((res) => {
                this.totalItems.set(res.total);
                this.currentPage.set(res.current_page);
            });
    }

    /**
     * Muda a página atual da paginação
     * @param e
     */
    handlePageEvent(e: PageEvent): void {
        this.currentPage.set(e.pageIndex + 1);
        this.pageSize.set(e.pageSize);
        this.loadData();
    }

    /**
     * Se houver dados em pillar abre o modal de edição
     * se não houver, abre o modal de criação
     * @param pillar
     */
    openForm(pillar?: Pillar): void {
        const dialogRef = this.dialog.open(PillarFormComponent, {
            width: '500px',
            data: pillar || null,
        });

        dialogRef.afterClosed().subscribe((formData) => {
            if (!formData) return;

            const request$ = pillar
                ? this.pillarService.update(pillar.id, formData)
                : this.pillarService.create(formData);

            request$.subscribe(() => this.loadData());
        });
    }

    /**
     * Abre o modal de exclusão
     * @param id
     */
    onDelete(id: string): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Excluir Pilar',
                message: 'Esta ação não poderá ser desfeita. Confirmar?',
            },
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.pillarService.delete(id).subscribe(() => this.loadData());
            }
        });
    }
}
