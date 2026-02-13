import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { ThemeService } from '@core/services/theme.service';
import { LoginCredentials } from '@shared/models/auth.model';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressBarModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    private notification = inject(NotificationService);
    public themeService = inject(ThemeService);

    isDarkMode = computed(() => {
        const mode = this.themeService.themeMode();
        if (mode === 'system') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return mode === 'dark';
    });
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
                    const firstName = user.name.split(' ')[0];
                    this.notification.success(`Bem-vindo de volta, ${firstName}!`);
                },
                error: () => this.isLoading.set(false),
            });
        }
    }
}
