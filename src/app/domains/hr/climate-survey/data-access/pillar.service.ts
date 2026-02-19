import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import {
    Pillar,
    CreatePillarDto,
    PillarsPaginated,
    SiglePillarResponse,
} from '../models/pillars.model';

@Injectable({ providedIn: 'root' })
export class PillarService {
    // Injeção de dependência
    private readonly http = inject(HttpClient);

    // Endpoint do serviço
    private readonly ENDPOINT = '/api/formmanagement/pillars';

    // Privado
    private readonly _pillars = signal<Pillar[]>([]);
    private readonly _loading = signal<boolean>(false);

    // Público
    public readonly pillars = this._pillars.asReadonly();
    public readonly loading = this._loading.asReadonly();

    /**
     * Busca uma lista paginada de pilares no backend.
     * @param page O número da página (iniciando em 1 para padrão Laravel).
     * @param perPage A quantidade de registros por página.
     * @returns Observable contendo os metadados de paginação e a lista de pilares.
     */
    public getPillarsPaginated(page: number, perPage: number): Observable<PillarsPaginated> {
        const params = new HttpParams()
            .set('page', page.toString())
            .set('per_page', perPage.toString());

        this._loading.set(true);

        return this.http.get<PillarsPaginated>(this.ENDPOINT, { params }).pipe(
            tap((res) => this._pillars.set(res.data)),
            finalize(() => this._loading.set(false)),
        );
    }

    /**
     * Envia os dados para a criação de um novo pilar.
     * @param data Objeto contendo os dados do pilar (título e descrição).
     * @returns Observable com a resposta do pilar criado.
     */
    public create(data: CreatePillarDto): Observable<SiglePillarResponse> {
        return this.http.post<SiglePillarResponse>(this.ENDPOINT, data);
    }

    /**
     * Atualiza um pilar existente identificado pelo seu UUID.
     * @param id O identificador único do pilar.
     * @param data Dados parciais ou totais para atualização.
     * @returns Observable com a resposta do pilar atualizado.
     */
    public update(id: string, data: Partial<CreatePillarDto>): Observable<SiglePillarResponse> {
        return this.http.put<SiglePillarResponse>(`${this.ENDPOINT}/${id}`, data);
    }

    /**
     * Remove permanentemente um pilar do sistema.
     * @param id O identificador único do pilar a ser excluído.
     * @returns Observable vazio indicando o sucesso da operação.
     */
    public delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.ENDPOINT}/${id}`);
    }
}
