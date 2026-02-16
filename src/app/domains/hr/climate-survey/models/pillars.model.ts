import { LaravelPaginatedResponse, LaravelResponse } from '@shared/models/api.model';

export interface Pillar {
    id: string;
    title: string;
    description: string;
    created_at?: string;
    updated_at?: string;
}

export type PillarsPaginated = LaravelPaginatedResponse<Pillar>;

export type SiglePillarResponse = LaravelResponse<Pillar>;

export type CreatePillarDto = Pick<Pillar, 'title' | 'description'>;
