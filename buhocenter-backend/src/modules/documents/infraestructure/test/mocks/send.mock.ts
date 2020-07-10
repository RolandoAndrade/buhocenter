import { ClientsCsvPetromilesInterface } from '../../interfaces/clients-csv.petromiles.interface';

export const sendMock: ClientsCsvPetromilesInterface[] = [
    {
        confirmationId: '2',
        apiKey: 'uLYAEka6cv',
        date: new Date().toISOString(),
        userEmail: 'a@g.com',
        pointsToDollars: '27500',
        commission: '1450',
        accumulatedPoints: '137500',
    },
    {
        confirmationId: '2',
        apiKey: 'uLYAEka6cv',
        date: new Date().toISOString(),
        userEmail: 'b@g.com',
        pointsToDollars: '27500',
        commission: '1450',
        accumulatedPoints: '137500',
    },
    {
        confirmationId: '2',
        apiKey: 'uLYAEka6cv',
        date: new Date().toISOString(),
        userEmail: 'c@g.com',
        pointsToDollars: '27500',
        commission: '1450',
        accumulatedPoints: '137500',
    },
];
