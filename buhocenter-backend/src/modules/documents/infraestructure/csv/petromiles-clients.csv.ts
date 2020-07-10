import { CsvRtc4180 } from './csv.rtc4180';
import { ClientsCsvPetromilesInterface } from '../interfaces/clients-csv.petromiles.interface';
import { ReadStream } from 'fs';

export class PetromilesClientsCsv extends CsvRtc4180 {
    generate(data: ClientsCsvPetromilesInterface[], fileName?: string): ReadStream {
        return super.generate(data, fileName);
    }

    getKeys(): string[] {
        return [
            'confirmationId',
            'apiKey',
            'date',
            'userEmail',
            'pointsToDollars',
            'commission',
            'accumulatedPoints',
        ];
    }
}
