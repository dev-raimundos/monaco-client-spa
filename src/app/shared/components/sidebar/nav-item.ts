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
                    class="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-all duration-200 hover:bg-muted"
                    [class.text-primary]="isOpen()"
                    [class.text-muted-foreground]="!isOpen()"
                >
                    @if (item.icon) {
                        <span class="material-symbols-rounded text-[22px] opacity-80">{{
                            item.icon
                        }}</span>
                    }
                    <span class="flex-1 truncate">{{ item.label }}</span>
                    <span
                        class="material-symbols-rounded text-lg transition-transform duration-500 opacity-50"
                        [class.rotate-180]="isOpen()"
                        >expand_more</span
                    >
                </button>

                <div
                    class="grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out ml-4 border-l border-border/60"
                    [style.grid-template-rows]="isOpen() ? '1fr' : '0fr'"
                    [class.opacity-100]="isOpen()"
                    [class.opacity-0]="!isOpen()"
                    [class.mt-1]="isOpen()"
                >
                    <div class="min-h-0 overflow-hidden">
                        <div class="pl-4 py-1 space-y-1">
                            @for (child of item.children; track child.label) {
                                <app-nav-item [item]="child" />
                            }
                        </div>
                    </div>
                </div>
            } @else {
                <a
                    [routerLink]="item.route"
                    routerLinkActive="bg-muted text-primary font-semibold"
                    [routerLinkActiveOptions]="{ exact: true }"
                    class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                >
                    @if (item.icon) {
                        <span class="material-symbols-rounded text-[22px] opacity-80">{{
                            item.icon
                        }}</span>
                    }
                    <span class="truncate">{{ item.label }}</span>
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
