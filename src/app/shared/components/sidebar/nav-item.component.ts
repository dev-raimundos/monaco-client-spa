import { Component, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

export interface NavItem {
    label: string;
    route?: string;
    icon?: string;
    service?: string;
    children?: NavItem[];
}

@Component({
    selector: 'app-nav-item',
    standalone: true,
    imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule, MatRippleModule],
    template: `
        <div class="flex flex-col">
            @if (item().children && item().children!.length > 0) {
                <button
                    matRipple
                    (click)="toggle()"
                    class="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-300 relative overflow-hidden"
                    [class.bg-white/5]="isOpen()"
                >
                    @if (item().icon) {
                        <mat-icon
                            class="w-5.5! h-5.5! text-[22px]! transition-colors"
                            [class.text-monaco-yellow]="isOpen()"
                            [class.text-white/60]="!isOpen()"
                        >
                            {{ item().icon }}
                        </mat-icon>
                    }

                    <span
                        class="flex-1 font-medium leading-tight transition-colors"
                        [class.text-white]="isOpen()"
                        [class.text-white/60]="!isOpen()"
                    >
                        {{ item().label }}
                    </span>

                    <mat-icon
                        class="w-4.5! h-4.5! text-[18px]! transition-all duration-500"
                        [class.rotate-180]="isOpen()"
                        [class.text-monaco-yellow]="isOpen()"
                        [class.text-white/20]="!isOpen()"
                    >
                        expand_more
                    </mat-icon>
                </button>

                <div
                    class="grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out ml-4 border-l-2"
                    [style.grid-template-rows]="isOpen() ? '1fr' : '0fr'"
                    [class.border-monaco-yellow/40]="isOpen()"
                    [class.border-white/10]="!isOpen()"
                    [class.opacity-100]="isOpen()"
                    [class.opacity-0]="!isOpen()"
                >
                    <div class="min-h-0">
                        <div class="pl-2 py-1 space-y-1">
                            @for (child of item().children; track child.label) {
                                <app-nav-item [item]="child" />
                            }
                        </div>
                    </div>
                </div>
            } @else {
                <a
                    [routerLink]="item().route"
                    routerLinkActive="active-link"
                    #rla="routerLinkActive"
                    [routerLinkActiveOptions]="{ exact: true }"
                    matRipple
                    class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-white/5 relative overflow-hidden"
                    [class.bg-monaco-yellow/10]="rla.isActive"
                >
                    @if (item().icon) {
                        <mat-icon
                            class="w-5.5! h-5.5! text-[22px]! transition-colors"
                            [class.text-monaco-yellow]="rla.isActive"
                            [class.text-white/60]="!rla.isActive"
                        >
                            {{ item().icon }}
                        </mat-icon>
                    }
                    <span
                        class="font-medium leading-tight transition-colors"
                        [class.text-white]="rla.isActive"
                        [class.text-white/60]="!rla.isActive"
                    >
                        {{ item().label }}
                    </span>
                </a>
            }
        </div>
    `,
    styles: [
        `
            :host {
                display: block;
            }
            .active-link span {
                font-weight: 700;
                color: white !important;
            }
        `,
    ],
})
export class NavItemComponent {
    item = input.required<NavItem>();
    public isOpen = signal(false);

    toggle() {
        this.isOpen.update((v) => !v);
    }
}
