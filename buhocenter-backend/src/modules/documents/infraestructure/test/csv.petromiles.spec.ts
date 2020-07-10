import { CsvGenerator } from '../../repositories/csv.generator';
import { CsvRtc4180 } from '../csv/csv.rtc4180';
import { sendMock } from './mocks/send.mock';
import { ReadStream } from 'fs';
import { PetromilesClientsCsv } from '../csv/petromiles-clients.csv';

describe('csv with rtc4180 format for petromiles', () => {
    let csvGenerator: CsvGenerator;
    beforeEach(() => {
        csvGenerator = new PetromilesClientsCsv();
    });
    describe('must create a csv file', () => {
        it('simple csv file with data of example', () => {
            const r = csvGenerator.generate(sendMock);
            expect(r).toBeDefined();
            expect(r).toBeInstanceOf(ReadStream);
        });
    });
});
