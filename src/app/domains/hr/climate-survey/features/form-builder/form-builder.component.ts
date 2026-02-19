import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-form-builder',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './form-builder.component.html',
    styleUrl: './form-builder.component.css',
})
export class FormBuilderComponent {
    private fb = inject(FormBuilder);

    public readonly form = this.fb.group({
        title: ['', Validators.required],
        questions: this.fb.array([]),
    });

    public get questions() {
        return this.form.get('questions') as FormArray;
    }

    public addQuestion() {
        const questionForm = this.fb.group({
            text: ['', Validators.required],
            type: ['short_answer', Validators.required],
        });
        this.questions.push(questionForm);
    }

    public removeQuestion(index: number) {
        this.questions.removeAt(index);
    }

    public onSubmit() {
        if (this.form.valid) {
            console.log('Dados para o Back-end:', this.form.value);
        }
    }
}
