import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from '../../models/table-config.model';
import { TableModule } from 'primeng/table';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-shared-table',
    standalone: true,
    imports: [CommonModule, TableModule, PaginatorModule, ButtonModule],
    template: `
        <div class="rounded-lg border border-border bg-card overflow-hidden shadow-sm">
            <p-table [value]="data()" class="p-datatable-sm" [responsiveLayout]="'scroll'">
                <ng-template pTemplate="header">
                    <tr class="border-b border-border">
                        @for (col of columns(); track col.key) {
                            <th
                                class="py-4 px-6 text-left font-bold text-foreground lowercase bg-transparent"
                            >
                                {{ col.label }}
                            </th>
                        }
                        <th
                            class="px-6 text-right font-bold text-foreground lowercase bg-transparent"
                        >
                            ações
                        </th>
                    </tr>
                </ng-template>

                <ng-template pTemplate="body" let-item>
                    <tr class="hover:bg-muted/30 border-b border-border transition-colors">
                        @for (col of columns(); track col.key) {
                            <td class="py-3 px-6 text-sm text-foreground">
                                {{ item[col.key] }}
                            </td>
                        }
                        <td class="px-6 py-2 text-right">
                            <div class="flex justify-end gap-1">
                                <button
                                    pButton
                                    class="p-button-text p-button-rounded action-btn edit-btn"
                                    (click)="edit.emit(item.id)"
                                    title="editar"
                                >
                                    <span class="material-symbols-rounded">edit_square</span>
                                </button>

                                <button
                                    pButton
                                    class="p-button-text p-button-rounded action-btn delete-btn"
                                    (click)="delete.emit(item.id)"
                                    title="excluir"
                                >
                                    <span class="material-symbols-rounded">delete</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                </ng-template>

                <ng-template pTemplate="emptymessage">
                    <tr>
                        <td
                            [attr.colspan]="columns().length + 1"
                            class="p-12 text-center text-muted-foreground lowercase"
                        >
                            nenhum registro encontrado.
                        </td>
                    </tr>
                </ng-template>
            </p-table>

            <p-paginator
                [rows]="pageSize()"
                [totalRecords]="totalItems()"
                [rowsPerPageOptions]="[5, 10, 20]"
                [first]="(currentPage() - 1) * pageSize()"
                (onPageChange)="pageChange.emit($event)"
                class="border-t border-border bg-transparent lowercase"
            />
        </div>
    `,
    styles: [
        `
            .action-btn {
                width: 32px !important;
                height: 32px !important;
                padding: 0 !important;
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                color: var(--muted-foreground) !important;
                background: transparent !important;
                border: none !important;
            }

            .action-btn span {
                font-size: 20px;
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

    pageChange = output<PaginatorState>();
}
