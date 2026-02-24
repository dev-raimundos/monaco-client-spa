import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PillarService } from '../../data-access/pillar.service';
import { PillarFormComponent } from '../../ui/pillar-form/pillar-form.component';
import { ConfirmDialogComponent } from '@shared/components/dialog/confirm-dialog.component';
import { Pillar, CreatePillarDto } from '../../models/pillars.model';

@Component({
    selector: 'app-pillar-list',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatTableModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
    ],
    providers: [DatePipe, TitleCasePipe],
    templateUrl: './pillar-list.component.html',
    styles: [``],
})
export class PillarListComponent implements OnInit {
    protected readonly pillarService = inject(PillarService);
    private readonly dialog = inject(MatDialog);

    public readonly displayedColumns = ['title', 'description', 'updated_at', 'actions'];

    public totalItems = signal(0);
    public pageSize = signal(10);
    public currentPage = signal(1);

    ngOnInit(): void {
        this.loadData();
    }

    private loadData(): void {
        this.pillarService.getPillarsPaginated(this.currentPage(), this.pageSize()).subscribe((res) => {
            this.totalItems.set(res.total);
            this.currentPage.set(res.current_page);
        });
    }

    public handlePageEvent(e: PageEvent): void {
        this.currentPage.set(e.pageIndex + 1);
        this.pageSize.set(e.pageSize);
        this.loadData();
    }

    public onCreate(): void {
        const dialogRef = this.dialog.open(PillarFormComponent, {
            width: '500px',
            data: null,
        });

        dialogRef.afterClosed().subscribe((formData: CreatePillarDto) => {
            if (formData) {
                this.pillarService.create(formData).subscribe(() => {
                    this.loadData();
                });
            }
        });
    }

    public onEdit(pillar: Pillar): void {
        const dialogRef = this.dialog.open(PillarFormComponent, {
            width: '500px',
            data: pillar,
        });

        dialogRef.afterClosed().subscribe((formData: CreatePillarDto) => {
            if (formData) {
                this.pillarService.update(pillar.id, formData).subscribe(() => {
                    this.loadData();
                });
            }
        });
    }

    public onDelete(id: string): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Excluir Pilar',
                message: 'Esta ação não poderá ser desfeita. Confirmar?',
            },
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.pillarService.delete(id).subscribe(() => {
                    this.loadData();
                });
            }
        });
    }
}
