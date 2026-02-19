import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Pillar } from '../../models/pillars.model';

@Component({
    selector: 'app-pillar-form',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
    ],
    templateUrl: './pillar-form.component.html',
})
export class PillarFormComponent implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly dialogRef = inject(MatDialogRef<PillarFormComponent>);
    public readonly data: Pillar | null = inject(MAT_DIALOG_DATA, { optional: true });

    public readonly form = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', [Validators.required]],
    });

    public ngOnInit(): void {
        if (this.data) this.form.patchValue(this.data);
    }

    public save(): void {
        if (this.form.valid) this.dialogRef.close(this.form.value);
        else this.form.markAllAsTouched();
    }

    public cancel(): void {
        this.dialogRef.close();
    }
}
