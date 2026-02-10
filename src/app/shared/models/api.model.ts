export interface LaravelResponse<T> {
    error: boolean;
    message: string;
    data: T;
}

export interface LaravelPaginatedResponse<T> {
    error: boolean;
    message: string;
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}
