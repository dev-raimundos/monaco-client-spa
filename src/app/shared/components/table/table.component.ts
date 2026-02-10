import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TableColumn } from '../../models/table-config.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEdit, lucideTrash2 } from '@ng-icons/lucide';

@Component({
    selector: 'app-shared-table',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        MatPaginatorModule,
        NgIcon,
    ],
    providers: [
        provideIcons({ lucideEdit, lucideTrash2 }),
    ],
    template: `
        <div class="mat-elevation-z1 overflow-hidden rounded-lg">
            <table mat-table [dataSource]="data()" class="w-full">
                @for (col of columns(); track col.key) {
                    <ng-container [matColumnDef]="col.key">
                        <th mat-header-cell *matHeaderCellDef>{{ col.label }}</th>
                        <td mat-cell *matCellDef="let item">{{ item[col.key] }}</td>
                    </ng-container>
                }

                <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef class="text-right px-4">Ações</th>
                    <td mat-cell *matCellDef="let item" class="text-right px-4">
                        <button mat-icon-button color="primary" (click)="edit.emit(item.id)">
                            <ng-icon name="lucideEdit" size="18"></ng-icon>
                        </button>
                        <button mat-icon-button color="warn" (click)="delete.emit(item.id)">
                            <ng-icon name="lucideTrash2" size="18"></ng-icon>
                        </button>
                    </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="allDisplayedColumns()"></tr>
                <tr mat-row *matRowDef="let row; columns: allDisplayedColumns()"></tr>

                <tr class="mat-row" *matNoDataRow>
                    <td
                        class="mat-cell p-10 text-center"
                        [attr.colspan]="allDisplayedColumns().length"
                    >
                        Nenhum registro encontrado.
                    </td>
                </tr>
            </table>

            <mat-paginator
                [length]="totalItems()"
                [pageSize]="pageSize()"
                [pageIndex]="currentPage() - 1"
                [pageSizeOptions]="[5, 10, 20]"
                (page)="pageChange.emit($event)"
                showFirstLastButtons
            >
            </mat-paginator>
        </div>
    `,
})
export class AppTableComponent<T> {
    data = input.required<T[]>();
    columns = input.required<TableColumn[]>();

    totalItems = input<number>(0);
    pageSize = input<number>(5);
    currentPage = input<number>(1);

    edit = output<string>();
    delete = output<string>();
    pageChange = output<PageEvent>();

    allDisplayedColumns = computed(() => [...this.columns().map((c) => c.key), 'actions']);
}
