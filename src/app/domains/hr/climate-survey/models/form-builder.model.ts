export type QuestionType = 'short_answer' | 'multiple_choice';

export interface Question {
    text: string;
    type: QuestionType;
    options?: string[];
}

export interface CustomForm {
    title: string;
    questions: Question[];
}
