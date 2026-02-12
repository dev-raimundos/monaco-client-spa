import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Core & Shared
import { PillarService } from '../../data-access/pillar.service';
import { AppTableComponent } from '@shared/components/table/table-paginated.component';
import { TableColumn } from '@shared/models/table-config.model';
import { NotificationService } from '@core/services/notification.service';
import { Pillar, CreatePillarDto } from '../../models/pillars.model';

// UI Components
import { PillarFormComponent } from '../../ui/pillar-form/pillar-form.component';

// PrimeNG Stack
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { PaginatorState } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-pillar-list',
    standalone: true,
    imports: [
        CommonModule,
        AppTableComponent,
        ProgressSpinnerModule,
        ButtonModule,
        DialogModule,
        PillarFormComponent,
    ],
    templateUrl: './pillar-list.component.html',
})
export class PillarListComponent implements OnInit {
    private readonly _pillarService = inject(PillarService);
    private readonly _notification = inject(NotificationService);

    // Sinais vinculados ao Service (Data-Access)
    public pillars = this._pillarService.pillars;
    public isLoading = this._pillarService.loading;

    // Sinais para controle do estado local (UI)
    public isDialogVisible = signal(false);
    public isSaving = signal(false);
    public selectedPillar = signal<Pillar | null>(null);

    // Sinais da paginação
    public total = signal(0);
    public pageSize = signal(15);
    public currentPage = signal(1);

    public myColumns: TableColumn[] = [
        { key: 'title', label: 'Título do pilar' },
        { key: 'description', label: 'Descrição' },
    ];

    ngOnInit(): void {
        this.fetchPillars();
    }

    /**
     * Busca os dados no servidor.
     */
    fetchPillars(page: number = 1, size: number = 5): void {
        this._pillarService.getPillarsPaginated(page, size).subscribe((res) => {
            this.total.set(res.total);
            this.pageSize.set(res.per_page);
            this.currentPage.set(res.current_page);
        });
    }

    /**
     * Gerencia a troca de páginas.
     */
    handlePage(event: PaginatorState) {
        const pageToFetch = (event.page ?? 0) + 1;
        this.fetchPillars(pageToFetch, event.rows ?? 5);
    }

    /**
     * Prepara o estado para criar um novo registro.
     */
    openCreate() {
        this.selectedPillar.set(null);
        this.isDialogVisible.set(true);
    }

    /**
     * Prepara o estado para edição recebendo o objeto completo da tabela.
     */
    onEdit(pillar: Pillar): void {
        this.selectedPillar.set(pillar);
        this.isDialogVisible.set(true);
    }

    /**
     * Orquestra a persistência (Criação ou Edição).
     */
    handleSave(data: CreatePillarDto) {
        this.isSaving.set(true);
        const pilarAtual = this.selectedPillar();

        // Se pilarAtual existe, é PUT; caso contrário, POST.
        const request = pilarAtual
            ? this._pillarService.update(pilarAtual.id, data)
            : this._pillarService.create(data);

        request.subscribe({
            next: () => {
                this._notification.success(
                    `Pilar ${pilarAtual ? 'atualizado' : 'criado'} com sucesso!`,
                );
                this.isDialogVisible.set(false);
                this.fetchPillars(this.currentPage());
            },
            error: () => this.isSaving.set(false),
            complete: () => this.isSaving.set(false),
        });
    }

    /**
     * Remove um registro.
     */
    onDelete(id: string): void {
        if (confirm('Deseja realmente excluir este pilar?')) {
            this._pillarService.delete(id).subscribe(() => {
                this._notification.success('Pilar removido com sucesso.');
                this.fetchPillars(this.currentPage());
            });
        }
    }
}
