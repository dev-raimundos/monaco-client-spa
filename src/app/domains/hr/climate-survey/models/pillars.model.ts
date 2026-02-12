import { LaravelPaginatedResponse, LaravelResponse } from '@shared/models/api.model';

export interface Pillar {
    id: string;
    title: string;
    description: string;
    created_at?: string;
    updated_at?: string;
}

export type CreatePillarDto = Pick<Pillar, 'title' | 'description'>;
