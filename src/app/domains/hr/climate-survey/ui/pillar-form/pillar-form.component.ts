import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Pillar, CreatePillarDto } from '../../models/pillars.model';

@Component({
    selector: 'app-pillar-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
    ],
    templateUrl: './pillar-form.component.html',
})
export class PillarFormComponent {
    private readonly fb = inject(FormBuilder);
    private readonly dialogRef = inject(MatDialogRef<PillarFormComponent>);
    // Injeção dos dados enviados pela página (Pillar ou null)
    public readonly data = inject<{ pillar: Pillar | null }>(MAT_DIALOG_DATA);

    public isSaving = signal(false);
    public isEdit = !!this.data.pillar;

    public form = this.fb.group({
        title: [this.data.pillar?.title || '', [Validators.required, Validators.minLength(3)]],
        description: [this.data.pillar?.description || '', [Validators.required]],
    });

    public cancel(): void {
        this.dialogRef.close(false);
    }

    public submit(): void {
        if (this.form.valid) {
            this.isSaving.set(true);
            // Retorna os dados para o componente pai tratar o salvamento
            this.dialogRef.close(this.form.value as CreatePillarDto);
        }
    }
}
