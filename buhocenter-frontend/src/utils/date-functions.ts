import moment from 'moment';

export function getDate(dateWithTimezone: string): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return new Date(dateWithTimezone).toLocaleString('es-es', options);
}

export function formatDate(date: string): string {
    return moment(date).format('DD/MM/YYYY - HH:MM:SS');
}
