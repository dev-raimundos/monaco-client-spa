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
        service: 'humanresources',
        children: [
            {
                label: 'Pesquisa de Clima',
                service: 'prodeval',
                children: [
                    {
                        label: 'Dashboard',
                        route: 'hr/climate-survey/pillars',
                        service: 'prodeval.list',
                    },
                    { label: 'Indicadores', route: '/rh/folha/decimo', service: 'prodeval.update' },
                ],
            },
            { label: 'Outros', route: '/rh/cargos', service: 'occupations.list' },
        ],
    },
];
