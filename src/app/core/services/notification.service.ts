import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class NotificationService {

    private messageService = inject(MessageService);

    success(message: string): void {
        this.messageService.add({
            severity: 'success',
            summary: 'sucesso',
            detail: message,
            life: 4000,
        });
    }

    error(message: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'erro',
            detail: message,
            life: 5000,
        });
    }

    info(message: string): void {
        this.messageService.add({
            severity: 'info',
            summary: 'informação',
            detail: message,
            life: 4000,
        });
    }
}
