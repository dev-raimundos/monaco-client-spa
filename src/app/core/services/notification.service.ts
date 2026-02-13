import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private _snackBar = inject(MatSnackBar);

    private readonly defaultConfig: MatSnackBarConfig = {
        duration: 4000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
    };

    success(message: string): void {
        this._snackBar.open(message, 'OK', {
            ...this.defaultConfig,
            panelClass: ['snackbar-success'],
        });
    }

    error(message: string): void {
        this._snackBar.open(message, 'FECHAR', {
            ...this.defaultConfig,
            duration: 10000,
            panelClass: ['snackbar-error'],
        });
    }

    info(message: string): void {
        this._snackBar.open(message, 'ENTENDI', {
            ...this.defaultConfig,
            panelClass: ['snackbar-info'],
        });
    }
}
