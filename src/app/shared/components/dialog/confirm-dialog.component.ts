import { Component, inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    template: `
        <h2 mat-dialog-title>{{ data.title || 'Confirmar Exclusão' }}</h2>
        <mat-dialog-content>
            <p>{{ data.message || 'Tem certeza que deseja realizar esta ação?' }}</p>
        </mat-dialog-content>
        <mat-dialog-actions align="end">
            <button
                mat-button
                (click)="ref.close(false)"
            >
                Cancelar
            </button>
            <button
                mat-flat-button
                color="warn"
                (click)="ref.close(true)"
            >
                Confirmar
            </button>
        </mat-dialog-actions>
    `,
})
export class ConfirmDialogComponent {
    readonly ref = inject(MatDialogRef<ConfirmDialogComponent>);
    readonly data = inject<{ title: string; message: string }>(MAT_DIALOG_DATA);
}
