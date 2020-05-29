export function getDate(dateWithTimezone: string): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
    return new Date(dateWithTimezone).toLocaleString('es-es', options);
}