import { Component } from '@angular/core';

@Component({
    selector: 'app-error-page',
    standalone: true,
    imports: [],
    templateUrl: './error-page.component.html',
    styleUrl: './error-page.component.css',
})
export class ErrorPageComponent {
    /**
     * Recarrega a página inteira para reiniciar o ciclo de inicialização do Angular
     * e tentar nova conexão com o servidor.
     */
    retry(): void {
        window.location.reload();
    }
}
