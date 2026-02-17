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
    private readonly http = inject(HttpClient);
    private readonly ENDPOINT = '/api/formmanagement/pillars';

    pillars = signal<Pillar[]>([]);
    loading = signal<boolean>(false);

    /**
     * Retorna uma lista paginada de pilares da pesquisa de clima
     * @param page
     * @param perPage
     * @returns
     */
    getPillarsPaginated(page: number, perPage: number): Observable<PillarsPaginated> {
        const params = new HttpParams().set('page', page).set('per_page', perPage);
        this.loading.set(true);

        return this.http.get<PillarsPaginated>(this.ENDPOINT, { params }).pipe(
            tap((res) => this.pillars.set(res.data)),
            finalize(() => this.loading.set(false)),
        );
    }

    /**
     * Cria um novo pilar
     * @param data
     * @returns
     */
    create(data: CreatePillarDto): Observable<SiglePillarResponse> {
        return this.http.post<SiglePillarResponse>(this.ENDPOINT, data);
    }

    /**
     * Atualiza um pilar identificado pelo ID
     * @param id
     * @param data
     * @returns
     */
    update(id: string, data: Partial<CreatePillarDto>): Observable<SiglePillarResponse> {
        return this.http.put<SiglePillarResponse>(`${this.ENDPOINT}/${id}`, data);
    }

    /**
     * Deleta um pilar existente dado o seu ID
     * @param id
     * @returns
     */
    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.ENDPOINT}/${id}`);
    }
}
