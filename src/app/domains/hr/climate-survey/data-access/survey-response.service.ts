import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SubmitSurveyDTO, SurveyResponseResponse } from '../models/survey-response.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SurveyResponseService {
    private readonly http = inject(HttpClient);
    private readonly API = 'api/hr/form-management/survey-responses';

    public submit(data: SubmitSurveyDTO): Observable<SurveyResponseResponse> {
        return this.http.post<SurveyResponseResponse>(this.API, data);
    }

    public getByUser(surveyID: string): Observable<SurveyResponseResponse> {
        return this.http.get<SurveyResponseResponse>(`${this.API}/${surveyID}/my-response`);
    }
}
