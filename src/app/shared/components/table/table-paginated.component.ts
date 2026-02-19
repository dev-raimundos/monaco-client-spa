import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TableColumn } from '../../models/table-config.model';

@Component({
    selector: 'app-shared-table',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule],
    template: `
        <div class="mat-elevation-z1 rounded-lg overflow-hidden">
            <table mat-table [dataSource]="data()">
                @for (col of columns(); track col.key) {
                    <ng-container [matColumnDef]="col.key">
                        <th mat-header-cell *matHeaderCellDef class="font-bold">
                            {{ col.label }}
                        </th>
                        <td mat-cell *matCellDef="let item">
                            {{ item[col.key] }}
                        </td>
                    </ng-container>
                }

                <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef class="text-right font-bold">Ações</th>
                    <td mat-cell *matCellDef="let item" class="text-right">
                        <div class="flex justify-end gap-1">
                            <button mat-icon-button color="primary" (click)="edit.emit(item)" title="Editar">
                                <mat-icon>edit_square</mat-icon>
                            </button>

                            <button mat-icon-button color="warn" (click)="delete.emit(item.id)" title="Excluir">
                                <mat-icon>delete</mat-icon>
                            </button>
                        </div>
                    </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns()"></tr>
                <tr
                    mat-row
                    *matRowDef="let row; columns: displayedColumns()"
                    class="hover:bg-surface-variant/5 transition-colors"></tr>
            </table>

            <mat-paginator
                [length]="totalItems()"
                [pageSize]="pageSize()"
                [pageIndex]="currentPage() - 1"
                [pageSizeOptions]="[5, 10, 20]"
                [showFirstLastButtons]="true"
                (page)="pageChange.emit($event)" />
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
                width: 100%;
            }
            table {
                width: 100%;
            }
            .mat-mdc-cell,
            .mat-mdc-header-cell {
                font-size: 14px;
            }
        `,
    ],
})
export class AppTableComponent<T> {
    data = input.required<T[]>();
    columns = input.required<TableColumn[]>();
    totalItems = input<number>(0);
    pageSize = input<number>(5);
    currentPage = input<number>(1);

    edit = output<T>();
    delete = output<string>();
    pageChange = output<PageEvent>();
    displayedColumns = computed(() => [...this.columns().map((c) => c.key), 'actions']);
}
