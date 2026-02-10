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
    imports: [CommonModule, MatTableModule, MatButtonModule, MatPaginatorModule, NgIcon],
    providers: [provideIcons({ lucideEdit, lucideTrash2 })],
    template: `
        <div class="mat-elevation-z1 overflow-hidden rounded-lg bg-card">
            <table mat-table [dataSource]="data()" class="w-full">
                @for (col of columns(); track col.key) {
                    <ng-container [matColumnDef]="col.key">
                        <th mat-header-cell *matHeaderCellDef class="text-foreground font-bold">
                            {{ col.label }}
                        </th>
                        <td mat-cell *matCellDef="let item" class="text-foreground">
                            {{ item[col.key] }}
                        </td>
                    </ng-container>
                }

                <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef class="w-24 text-right px-4">Ações</th>
                    <td mat-cell *matCellDef="let item" class="text-right px-4 py-2">
                        <div class="flex justify-end items-center gap-1">
                            <button
                                mat-icon-button
                                class="compact-icon-button edit-btn"
                                (click)="edit.emit(item.id)"
                                title="Editar"
                            >
                                <ng-icon name="lucideEdit" size="18"></ng-icon>
                            </button>
                            <button
                                mat-icon-button
                                class="compact-icon-button delete-btn"
                                (click)="delete.emit(item.id)"
                                title="Excluir"
                            >
                                <ng-icon name="lucideTrash2" size="18"></ng-icon>
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
                        class="mat-cell p-10 text-center text-muted-foreground"
                        [attr.colspan]="allDisplayedColumns().length"
                    >
                        Nenhum registro encontrado.
                    </td>
                </tr>
            </table>

            <mat-paginator
                class="border-t border-border"
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
                background-color: var(--card) !important;
            }
            .custom-row:hover {
                background-color: color-mix(in srgb, var(--primary), transparent 92%) !important;
                transition: background-color 0.2s ease;
            }
            .compact-icon-button {
                width: 32px !important;
                height: 32px !important;
                min-width: 32px !important;
                padding: 0 !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                border-radius: 50% !important;
            }
            .compact-icon-button ng-icon {
                color: var(--muted-foreground);
                transition: color 0.2s ease;
            }
            .edit-btn:hover {
                background-color: color-mix(in srgb, var(--primary), transparent 90%) !important;
            }
            .edit-btn:hover ng-icon {
                color: var(--primary) !important;
            }
            .delete-btn:hover {
                background-color: color-mix(
                    in srgb,
                    var(--destructive),
                    transparent 90%
                ) !important;
            }
            .delete-btn:hover ng-icon {
                color: var(--destructive) !important;
            }
            .mat-mdc-header-cell {
                background-color: var(--card) !important;
                border-bottom: 1px solid var(--border) !important;
            }
            .mat-mdc-cell {
                padding-top: 8px !important;
                padding-bottom: 8px !important;
                border-bottom: 1px solid var(--border) !important;
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
    edit = output<string>();
    delete = output<string>();
    pageChange = output<PageEvent>();

    allDisplayedColumns = computed(() => [...this.columns().map((c) => c.key), 'actions']);
}
