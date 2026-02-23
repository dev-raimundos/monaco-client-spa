import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    RouterLink
],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
})
export class DashboardComponent {

    public totalResponses = 11;
    public activeSurveys = 1;
    public totalSurveys = 12;
    public averageIndex = 'N/A';

    public recentActivity: unknown[] = [];

    onUpdate() {
        console.log('Buscando novos valores da API...');
    }
}
