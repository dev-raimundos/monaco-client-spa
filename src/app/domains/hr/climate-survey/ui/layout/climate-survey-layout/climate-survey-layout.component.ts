import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-climate-survey-layout',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
    ],
    templateUrl: './climate-survey-layout.component.html',
    styleUrl: './climate-survey-layout.component.css',
})
export class ClimateSurveyLayoutComponent {}
