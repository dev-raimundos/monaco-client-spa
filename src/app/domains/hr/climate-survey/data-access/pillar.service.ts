import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import { Pillar, CreatePillarDto, PillarsPaginated, SiglePillarResponse } from '../models/pillars.model';

@Injectable({ providedIn: 'root' })
export class PillarService {
    private readonly http = inject(HttpClient);
    private readonly ENDPOINT = '/api/formmanagement/pillars';
    private readonly _pillars = signal<Pillar[]>([]);
    private readonly _loading = signal<boolean>(false);
    public readonly pillars = this._pillars.asReadonly();
    public readonly loading = this._loading.asReadonly();

    public getPillarsPaginated(page: number, perPage: number): Observable<PillarsPaginated> {
        const params = new HttpParams().set('page', page.toString()).set('per_page', perPage.toString());

        this._loading.set(true);

        return this.http.get<PillarsPaginated>(this.ENDPOINT, { params }).pipe(
            tap((res) => this._pillars.set(res.data)),
            finalize(() => this._loading.set(false)),
        );
    }

    public create(data: CreatePillarDto): Observable<SiglePillarResponse> {
        return this.http.post<SiglePillarResponse>(this.ENDPOINT, data);
    }

    public update(id: string, data: Partial<CreatePillarDto>): Observable<SiglePillarResponse> {
        return this.http.put<SiglePillarResponse>(`${this.ENDPOINT}/${id}`, data);
    }

    public delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.ENDPOINT}/${id}`);
    }
}
