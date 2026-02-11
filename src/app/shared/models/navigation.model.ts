import { InjectionToken } from '@angular/core';

export interface NavItem {
    label: string;
    route?: string;
    icon?: string;
    children?: NavItem[];
}

export const NAV_ITEMS_TOKEN = new InjectionToken<NavItem[]>('NAV_ITEMS_TOKEN');
