import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };

  success(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      ...this.defaultConfig,
      panelClass: ['success-snackbar'],
    });
  }

  error(message: string): void {
    this.snackBar.open(message, 'OK', {
      ...this.defaultConfig,
      panelClass: ['error-snackbar'], 
    });
  }

  info(message: string): void {
    this.snackBar.open(message, 'Entendi', {
      ...this.defaultConfig,
    });
  }
}
