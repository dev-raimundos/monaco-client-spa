import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '@core/services/auth.service';
import { ErrorPageComponent } from '@shared/components/error-page/error-page.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, ToastModule, ErrorPageComponent],
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    public authService = inject(AuthService);
    protected readonly title = signal('monaco-client-spa');
}
