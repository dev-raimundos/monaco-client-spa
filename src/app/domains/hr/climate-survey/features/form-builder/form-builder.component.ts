import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilderService } from '../../data-access/form-builder.service';
import { CreateSurveyDto, CreateQuestionDto } from '../../models/form-builder.model';
import { handleHttpError } from '@shared/operators/handle-error.operator';

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
        MatTooltip,
        MatProgressSpinnerModule,
    ],
    templateUrl: './form-builder.component.html',
    styleUrl: './form-builder.component.css',
})
export class FormBuilderComponent {
    private readonly fb = inject(FormBuilder);
    private readonly service = inject(FormBuilderService);
    private readonly snackBar = inject(MatSnackBar);

    public readonly loading = signal<boolean>(false);

    public readonly form = this.fb.group({
        title: ['', Validators.required],
        questions: this.fb.array([]),
    });

    public get questions(): FormArray {
        return this.form.get('questions') as FormArray;
    }

    public addQuestion(): void {
        const questionForm: FormGroup = this.fb.group({
            text: ['', Validators.required],
            type: ['multiple', Validators.required],
        });
        this.questions.push(questionForm);
    }

    public removeQuestion(index: number): void {
        this.questions.removeAt(index);
    }

    public onSubmit(): void {
        if (this.form.invalid || this.questions.length === 0) {
            return;
        }

        const payload: CreateSurveyDto = {
            title: this.form.value.title as string,
            questions: this.form.value.questions as CreateQuestionDto[],
        };

        this.loading.set(true);

        this.service
            .create(payload)
            .pipe(
                handleHttpError(this.snackBar, {
                    fallback: 'Erro ao salvar o formulário.',
                    onError: () => this.loading.set(false),
                }),
            )
            .subscribe({
                next: () => {
                    this.snackBar.open('Formulário salvo com sucesso!', 'Fechar', { duration: 3000 });
                    this.form.reset();
                    this.questions.clear();
                },
                complete: () => this.loading.set(false),
            });
    }
}
