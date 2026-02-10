import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import { LaravelPaginatedResponse } from '@shared/models';
import { Pillar, CreatePillarDto } from '../models/pillars.model';

@Injectable({ providedIn: 'root' })
export class PillarService {
    // DI
    private http = inject(HttpClient);
    // Endpoint
    private readonly ENDPOINT = '/api/formmanagement/pillars';

    pillars = signal<Pillar[]>([]);
    loading = signal<boolean>(false);

    getPillarsPaginated(
        page: number = 1,
        per_page: number = 5,
    ): Observable<LaravelPaginatedResponse<Pillar>> {

        const params = new HttpParams()
            .set('page', page)
            .set('per_page', per_page);

        this.loading.set(true);

        return this.http.get<LaravelPaginatedResponse<Pillar>>(this.ENDPOINT, { params }).pipe(
            tap((res) => this.pillars.set(res.data)),
            finalize(() => this.loading.set(false)),
        );
    }

    create(data: CreatePillarDto): Observable<any> {
        return this.http.post<any>(this.ENDPOINT, data);
    }

    update(id: string, data: CreatePillarDto): Observable<any> {
        return this.http.put<any>(`${this.ENDPOINT}/${id}`, data);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.ENDPOINT}/${id}`);
    }
}
