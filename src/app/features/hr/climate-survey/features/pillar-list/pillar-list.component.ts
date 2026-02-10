import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PillarService } from '../../data-access/pillar.service';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEdit, lucideTrash2, lucidePlus, lucideRefreshCcw } from '@ng-icons/lucide';

@Component({
    selector: 'app-pillar-list',
    standalone: true,
    imports: [
        CommonModule,
        NgIcon,
        HlmIcon,
        ...HlmTableImports,
        ...HlmButtonImports,
    ],
    providers: [provideIcons({ lucideEdit, lucideTrash2, lucidePlus, lucideRefreshCcw })],
    templateUrl: './pillar-list.component.html',
})
export class PillarListComponent implements OnInit {
    private readonly _pillarService = inject(PillarService);

    public pillars = this._pillarService.pillars;
    public isLoading = this._pillarService.loading;

    ngOnInit(): void {
        this.fetchPillars();
    }

    fetchPillars(page: number = 1): void {
        this._pillarService.getPillarsPaginated(page).subscribe();
    }

    onDelete(id: string): void {
        if (confirm('Deseja realmente excluir este pilar do Grupo Mônaco?')) {
            this._pillarService.delete(id).subscribe({
                next: () => this.fetchPillars(),
                error: () => {
                    // O interceptor emite notificação automaticamente.
                },
            });
        }
    }

    onEdit(id: string): void {
        console.log('Abrir modal de edição para ID:', id);
    }
}
