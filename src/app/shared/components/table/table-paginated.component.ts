import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TableColumn } from '../../models/table-config.model';

@Component({
    selector: 'app-shared-table',
    standalone: true,
    imports: [CommonModule, MatTableModule, MatButtonModule, MatPaginatorModule, MatIconModule],
    template: `
        <div class="mat-elevation-z1 overflow-hidden rounded-lg bg-card border border-border">
            <table mat-table [dataSource]="data()" class="w-full">
                @for (col of columns(); track col.key) {
                    <ng-container [matColumnDef]="col.key">
                        <th
                            mat-header-cell
                            *matHeaderCellDef
                            class="text-foreground font-bold py-4"
                        >
                            {{ col.label | lowercase }}
                        </th>
                        <td mat-cell *matCellDef="let item" class="text-foreground py-3 text-sm">
                            {{ item[col.key] }}
                        </td>
                    </ng-container>
                }

                <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef class="text-right px-6">ações</th>
                    <td mat-cell *matCellDef="let item" class="text-right px-6">
                        <div class="flex justify-end items-center gap-1">
                            <button
                                mat-icon-button
                                class="action-btn edit-btn"
                                (click)="edit.emit(item.id)"
                                title="Editar"
                            >
                                <mat-icon class="material-symbols-rounded">edit_square</mat-icon>
                            </button>

                            <button
                                mat-icon-button
                                class="action-btn delete-btn"
                                (click)="delete.emit(item.id)"
                                title="Excluir"
                            >
                                <mat-icon class="material-symbols-rounded">delete</mat-icon>
                            </button>
                        </div>
                    </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="allDisplayedColumns()"></tr>
                <tr
                    mat-row
                    *matRowDef="let row; columns: allDisplayedColumns()"
                    class="custom-row"
                ></tr>

                <tr class="mat-row" *matNoDataRow>
                    <td
                        class="mat-cell p-12 text-center text-muted-foreground lowercase"
                        [attr.colspan]="allDisplayedColumns().length"
                    >
                        nenhum registro encontrado.
                    </td>
                </tr>
            </table>

            <mat-paginator
                class="border-t border-border lowercase"
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
    styles: [
        `
            .mat-mdc-table {
                background-color: transparent !important;
            }

            .custom-row {
                transition: background-color 0.15s ease;
            }
            .custom-row:hover {
                background-color: color-mix(in srgb, var(--foreground), transparent 96%) !important;
            }

            .action-btn {
                color: var(--muted-foreground);
                transition: color 0.2s ease;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
            }

            .action-btn mat-icon {
                font-size: 20px;
                width: 20px;
                height: 20px;
                line-height: 1 !important;
                font-variation-settings:
                    'FILL' 0,
                    'wght' 400,
                    'GRAD' 0,
                    'opsz' 20;
            }

            .edit-btn:hover {
                color: var(--primary) !important;
            }
            .delete-btn:hover {
                color: var(--destructive) !important;
            }

            .mat-mdc-header-cell {
                text-transform: lowercase;
                letter-spacing: 0.025em;
                border-bottom: 1px solid var(--border) !important;
            }
        `,
    ],
})
export class AppTableComponent<T> {
    data = input.required<any[]>();
    columns = input.required<TableColumn[]>();
    totalItems = input<number>(0);
    pageSize = input<number>(5);
    currentPage = input<number>(1);
    edit = output<string>();
    delete = output<string>();
    pageChange = output<PageEvent>();

    allDisplayedColumns = computed(() => [...this.columns().map((c) => c.key), 'actions']);
}
