import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

// PrimeNG Stack
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IftaLabelModule } from 'primeng/iftalabel';

// Core Services
import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { LoginCredentials } from '@shared/models/auth.model';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        CardModule,
        InputTextModule,
        ButtonModule,
        IftaLabelModule,
    ],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private notification = inject(NotificationService);

    isLoading = signal(false);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
    });

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.isLoading.set(true);
            const credentials = this.loginForm.value as LoginCredentials;

            this.authService.login(credentials).subscribe({
                next: (user) => {
                    this.notification.success(`Bem-vindo, ${user.name}!`);
                },
                error: () => {
                    this.isLoading.set(false);
                },
            });
        }
    }
}
