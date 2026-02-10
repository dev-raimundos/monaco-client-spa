import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  private allUsers = signal([
    {
      id: 1,
      name: 'Raimundos Neto',
      email: 'raimundosmarque@grupomonaco.com.br',
      department: 'TI',
      occupation: 'Presidente',
      status: 'Ativo',
    },
    {
      id: 2,
      name: 'João Silva',
      email: 'joao@grupomonaco.com.br',
      department: 'Logística',
      occupation: 'Analista',
      status: 'Ativo',
    },
    {
      id: 3,
      name: 'Maria Souza',
      email: 'maria@grupomonaco.com.br',
      department: 'RH',
      occupation: 'Gerente',
      status: 'Inativo',
    },
    {
      id: 4,
      name: 'Carlos Lima',
      email: 'carlos@grupomonaco.com.br',
      department: 'Vendas',
      occupation: 'Consultor',
      status: 'Ativo',
    },
    {
      id: 5,
      name: 'Ana Paula',
      email: 'ana@grupomonaco.com.br',
      department: 'Financeiro',
      occupation: 'Diretora',
      status: 'Ativo',
    },
  ]);

  currentPage = signal(1);
  pageSize = signal(5);

  users = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.allUsers().slice(start, start + this.pageSize());
  });

  totalPages = computed(() => Math.ceil(this.allUsers().length / this.pageSize()));

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }
}
