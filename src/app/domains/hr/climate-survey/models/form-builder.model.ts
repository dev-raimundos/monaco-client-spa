import { LaravelPaginatedResponse, LaravelResponse } from '@shared/models/api.model';

export type QuestionType = 'multiple' | 'dissertation';

export interface QuestionOption {
    id: string;
    question_id: string;
    option_text: string;
}

export interface SurveyQuestion {
    id: string;
    survey_id: string;
    question_text: string;
    question_type: QuestionType;
    display_order: number;
    options?: QuestionOption[];
}

export interface ClimateSurvey {
    id: string;
    title: string;
    created_at?: string;
    updated_at?: string;
    questions?: SurveyQuestion[];
    questions_count?: number;
}

export interface CreateQuestionDto {
    text: string;
    type: QuestionType;
    options?: string[];
}

export interface CreateSurveyDto {
    title: string;
    questions: CreateQuestionDto[];
}

export type SurveyPaginatedResponse = LaravelPaginatedResponse<ClimateSurvey>;
export type SingleSurveyResponse = LaravelResponse<ClimateSurvey>;
