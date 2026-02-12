import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavItem {
    label: string;
    route?: string;
    icon?: string;
    children?: NavItem[];
}

@Component({
    selector: 'app-nav-item',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
        <div class="flex flex-col">
            @if (item.children && item.children.length > 0) {
                <button
                    (click)="toggle()"
                    class="group flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200"
                    [class.text-monaco-yellow]="isOpen()"
                    [class.font-bold]="isOpen()"
                    [class.text-muted-foreground]="!isOpen()"
                    [class.font-normal]="!isOpen()"
                >
                    @if (item.icon) {
                        <span
                            class="material-symbols-rounded text-[22px] transition-colors shrink-0"
                            [class.opacity-100]="isOpen()"
                            [class.opacity-60]="!isOpen()"
                        >
                            {{ item.icon }}
                        </span>
                    }

                    <span class="flex-1 pt-0.5 leading-tight wrap-break-word">
                        {{ item.label }}
                    </span>

                    <span
                        class="material-symbols-rounded text-lg transition-transform duration-500 opacity-50 shrink-0"
                        [class.rotate-180]="isOpen()"
                    >
                        expand_more
                    </span>
                </button>

                <div
                    class="grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out ml-3 border-l"
                    [style.grid-template-rows]="isOpen() ? '1fr' : '0fr'"
                    [class.border-monaco-yellow/30]="isOpen()"
                    [class.border-transparent]="!isOpen()"
                    [class.opacity-100]="isOpen()"
                    [class.opacity-0]="!isOpen()"
                    [class.mt-1]="isOpen()"
                >
                    <div class="min-h-0 overflow-hidden">
                        <div class="pl-2 py-1 space-y-1">
                            @for (child of item.children; track child.label) {
                                <app-nav-item [item]="child" />
                            }
                        </div>
                    </div>
                </div>
            } @else {
                <a
                    [routerLink]="item.route"
                    routerLinkActive
                    #rla="routerLinkActive"
                    [routerLinkActiveOptions]="{ exact: true }"
                    class="group flex items-start gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-muted/50"
                    [class.text-monaco-yellow]="rla.isActive"
                    [class.font-bold]="rla.isActive"
                    [class.text-muted-foreground]="!rla.isActive"
                    [class.font-normal]="!rla.isActive"
                >
                    @if (item.icon) {
                        <span
                            class="material-symbols-rounded text-[22px] shrink-0 transition-opacity"
                            [class.opacity-100]="rla.isActive"
                            [class.opacity-60]="!rla.isActive"
                        >
                            {{ item.icon }}
                        </span>
                    }
                    <span class="pt-0.5 leading-tight wrap-break-word">
                        {{ item.label }}
                    </span>
                </a>
            }
        </div>
    `,
})
export class NavItemComponent {
    @Input({ required: true }) item!: NavItem;
    public isOpen = signal(false);

    toggle() {
        this.isOpen.update((v) => !v);
    }
}
