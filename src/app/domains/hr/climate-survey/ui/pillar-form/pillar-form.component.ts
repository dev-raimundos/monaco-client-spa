import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Pillar, CreatePillarDto } from '../../models/pillars.model';

// PrimeNG
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
    selector: 'app-pillar-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        TextareaModule,
        ButtonModule,
        IftaLabelModule,
    ],
    template: ``,
})
export class PillarFormComponent {
    private fb = inject(FormBuilder);

    @Input() set pillar(val: Pillar | null) {
        if (val) {
            this.isEdit = true;
            this.form.patchValue(val);
        }
    }
    @Input() loading = false;
    @Output() save = new EventEmitter<CreatePillarDto>();
    @Output() cancel = new EventEmitter<void>();

    isEdit = false;
    form = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(3)]],
        description: ['', [Validators.required]],
    });

    submit() {
        if (this.form.valid) {
            this.save.emit(this.form.value as CreatePillarDto);
        }
    }
}
