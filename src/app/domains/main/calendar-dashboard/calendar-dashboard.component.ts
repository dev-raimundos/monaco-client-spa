import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions, EventContentArg } from '@fullcalendar/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-calendar-dashboard',
    standalone: true,
    imports: [CommonModule, FullCalendarModule],
    templateUrl: './calendar-dashboard.component.html',
    styleUrls: ['./calendar-dashboard.component.scss'],
})
export class CalendarDashboard implements OnInit {
    private http = inject(HttpClient);

    calendarOptions = signal<CalendarOptions>({
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        headerToolbar: {
            left: 'title',
            center: '',
            right: 'prev,today,next',
        },
        buttonText: { today: 'hoje' },
        height: 'auto',
        dayMaxEvents: 2,
        events: [],
        eventContent: this.renderEventContent,
        dayCellClassNames: (arg) => (arg.isToday ? ['is-today-cell'] : []),
    });

    ngOnInit() {
        this.fetchHolidays();
    }

    renderEventContent(arg: EventContentArg) {
        return {
            html: `<div class="monaco-event-wrapper">
                    <span class="monaco-event-dot"></span>
                    <span class="monaco-event-title">${arg.event.title}</span>
                   </div>`,
        };
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
                    className: 'monaco-holiday',
                }));

                this.calendarOptions.update((options) => ({
                    ...options,
                    events: holidayEvents,
                }));
            });
    }
}
