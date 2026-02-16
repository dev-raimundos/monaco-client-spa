import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import {
    Pillar,
    CreatePillarDto,
    SiglePillarResponse,
    PillarsPaginated,
} from '../models/pillars.model';

/**
 * Classe responsável pelas operações CRUD da tabela de Pilares do Pesquisa de Clima
 */
@Injectable({ providedIn: 'root' })
export class PillarService {
    private http = inject(HttpClient);
    private readonly ENDPOINT = '/api/formmanagement/pillars';

    pillars = signal<Pillar[]>([]);
    loading = signal<boolean>(false);

    /**
     * Retorna todos os pilares paginados
     * @param page
     * @param per_page
     * @returns
     */
    getPillarsPaginated(page: number = 1, per_page: number = 5): Observable<PillarsPaginated> {
        const params = new HttpParams().set('page', page).set('per_page', per_page);

        this.loading.set(true);

        return this.http.get<PillarsPaginated>(this.ENDPOINT, { params }).pipe(
            tap((res) => this.pillars.set(res.data)),
            finalize(() => this.loading.set(false)),
        );
    }

    /**
     * Cria um novo pilar de acordo com o DTO
     * @param data
     * @returns
     */
    create(data: CreatePillarDto): Observable<SiglePillarResponse> {
        return this.http.post<SiglePillarResponse>(this.ENDPOINT, data);
    }

    /**
     * Atualiza um pilar identificado pelo ID e de acordo com o DTO
     * @param id
     * @param data
     * @returns
     */
    update(id: string, data: CreatePillarDto): Observable<SiglePillarResponse> {
        return this.http.put<SiglePillarResponse>(`${this.ENDPOINT}/${id}`, data);
    }

    /**
     * Deleta um pilar de acordo com o ID
     * @param id
     * @returns
     */
    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.ENDPOINT}/${id}`);
    }
}
