import { NavItem } from '@shared/models/navigation.model';

export const SISMONACO_NAVIGATION: NavItem[] = [
    { label: 'dashboard', route: '/dashboard', icon: 'dashboard' }, // Nomes do Material Symbols
    {
        label: 'recursos humanos',
        icon: 'group',
        children: [
            { label: 'pesquisa de clima', route: '/rh/pesquisa-clima' },
            { label: 'folha de pagamento', route: '/rh/folha' },
            { label: 'cargos e salários', route: '/rh/cargos' },
        ],
    },
    {
        label: 'logística e frota',
        icon: 'local_shipping',
        children: [
            { label: 'controle de viagens', route: '/logistica/viagens' },
            { label: 'manutenção preventiva', route: '/logistica/manutencao' },
            { label: 'abastecimento', route: '/logistica/combustivel' },
        ],
    },
    {
        label: 'financeiro',
        icon: 'account_balance_wallet',
        children: [
            { label: 'contas a pagar', route: '/financeiro/pagar' },
            { label: 'fluxo de caixa', route: '/financeiro/caixa' },
        ],
    },
    { label: 'configurações', route: '/settings', icon: 'settings' },
];
