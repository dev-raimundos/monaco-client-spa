import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateSurveyDto, SingleSurveyResponse, SurveyPaginatedResponse } from '../models/form-builder.model';

@Injectable({
    providedIn: 'root',
})
export class FormBuilderService {
    private readonly http = inject(HttpClient);
    private readonly API = '/api/hr/form-management/form-builder';

    public list(perPage: number = 15, page: number = 1): Observable<SurveyPaginatedResponse> {
        const params = new HttpParams().set('per_page', perPage.toString()).set('page', page.toString());

        return this.http.get<SurveyPaginatedResponse>(this.API, { params });
    }

    public findById(id: string): Observable<SingleSurveyResponse> {
        return this.http.get<SingleSurveyResponse>(`${this.API}/${id}`);
    }

    public create(data: CreateSurveyDto): Observable<SingleSurveyResponse> {
        return this.http.post<SingleSurveyResponse>(this.API, data);
    }

    public update(id: string, data: CreateSurveyDto): Observable<SingleSurveyResponse> {
        return this.http.put<SingleSurveyResponse>(`${this.API}/${id}`, data);
    }

    public delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API}/${id}`);
    }
}
