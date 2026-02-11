import { NavItem } from '@shared/models/';

export const SISMONACO_NAVIGATION: NavItem[] = [
    { label: 'dashboard', route: '/dashboard', icon: 'lucideLayoutDashboard' },
    {
        label: 'recursos humanos',
        icon: 'lucideUsers',
        children: [
            { label: 'pesquisa de clima', route: '/rh/pesquisa-clima' },
            { label: 'folha de pagamento', route: '/rh/folha' },
            { label: 'cargos e salários', route: '/rh/cargos' },
        ],
    },
    {
        label: 'logística e frota',
        icon: 'lucideLayoutDashboard',
        children: [
            { label: 'controle de viagens', route: '/logistica/viagens' },
            { label: 'manutenção preventiva', route: '/logistica/manutencao' },
            { label: 'abastecimento', route: '/logistica/combustivel' },
        ],
    },
    {
        label: 'financeiro',
        icon: 'lucideUserCircle',
        children: [
            { label: 'contas a pagar', route: '/financeiro/pagar' },
            { label: 'fluxo de caixa', route: '/financeiro/caixa' },
        ],
    },
    { label: 'configurações', route: '/settings', icon: 'lucideMonitor' },
];
