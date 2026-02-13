import { NavItem } from '@shared/components/sidebar/nav-item.component';

export const NAVIGATION: NavItem[] = [
    {
        label: 'Calendário',
        route: '/dashboard',
        icon: 'dashboard',
    },
    {
        label: 'RH',
        icon: 'group',
        service: 'ti',
        children: [
            {
                label: 'Pesquisa de Clima',
                service: 'ti',
                children: [
                    {
                        label: 'Dashboard',
                        route: 'hr/climate-survey/pillars',
                        service: 'ti',
                    },
                    { label: 'Indicadores', route: '/rh/folha/decimo', service: 'ti' },
                ],
            },
            { label: 'Outros', route: '/rh/cargos', service: 'ti' },
        ],
    },
    {
        label: 'TI',
        icon: 'group',
        service: 'ti',
        children: [
            {
                label: 'Angular Material Example',
                service: 'ti.',
                children: [
                    {
                        label: 'Demos',
                        route: 'it/demo/material-demo',
                        service: 'ti',
                    },
                    { label: 'Indicadores', route: '/rh/folha/decimo', service: 'ti' },
                ],
            },
            { label: 'Outros', route: '/rh/cargos', service: 'ti' },
        ],
    },
];
