import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '@core/services/auth.service';
import { NotificationService } from '@core/services/notification.service';
import { LoginCredentials } from '@shared/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatIconModule,
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
