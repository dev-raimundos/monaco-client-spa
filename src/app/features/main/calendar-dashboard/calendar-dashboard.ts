import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions } from '@fullcalendar/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-calendar-dashboard',
    standalone: true,
    imports: [CommonModule, FullCalendarModule],
    templateUrl: './calendar-dashboard.html',
    styleUrls: ['./calendar-dashboard.css'],
})
export class CalendarDashboard implements OnInit {
    private http = inject(HttpClient);

    calendarOptions = signal<CalendarOptions>({
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek',
        },
        events: [],
        height: 'auto',
        expandRows: true,
    });

    ngOnInit() {
        this.fetchHolidays();
    }

    fetchHolidays() {
        const year = new Date().getFullYear();
        this.http
            .get<any[]>(`https://brasilapi.com.br/api/feriados/v1/${year}`)
            .subscribe((holidays) => {
                const holidayEvents = holidays.map((h) => ({
                    title: h.name,
                    start: h.date,
                    allDay: true,
                    className: 'holiday-event',
                    display: 'block',
                }));

                this.calendarOptions.update((options) => ({
                    ...options,
                    events: holidayEvents,
                }));
            });
    }
}
