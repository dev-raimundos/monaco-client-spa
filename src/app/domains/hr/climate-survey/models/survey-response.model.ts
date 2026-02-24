import { LaravelResponse } from '@shared/models/api.model';

export type AnswerValue = 'Sempre' | 'Na maioria das vezes' | 'Raramente' | 'Nunca';

export interface ResponseAnswer {
    id: string;
    response_id: string;
    question_id: string;
    answer: AnswerValue;
    created_at: string;
    updated_at: string;
}

export interface SurveyResponse {
    id: string;
    survey_id: string;
    user_id: string;
    answered_at: string;
    created_at: string;
    updated_at: string;
    answers?: ResponseAnswer[];
}

export interface SubmitSurveyDTO {
    survey_id: string;
    answers: {
        question_id: string;
        answer: AnswerValue;
    }[];
}

export type SurveyResponseResponse = LaravelResponse<SurveyResponse>;
