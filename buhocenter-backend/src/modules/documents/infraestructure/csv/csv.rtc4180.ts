import { CsvGenerator } from '../../repositories/csv.generator';
import * as fs from 'fs';
import { ReadStream } from 'fs';

export abstract class CsvRtc4180 extends CsvGenerator {
    generate(
        data: Array<{ [p: string]: any }>,
        fileName = `reports/csv/${new Date().toISOString()}.csv`,
    ): ReadStream {
        try {
            const labels = this.getKeys();
            const csv = data.map(i => {
                return labels
                    .map(j => {
                        return i[j];
                    })
                    .join(',');
            });
            csv.unshift(labels.join(','));
            const content = csv.join('\r\n');

            fs.mkdirSync('reports/csv', { recursive: true });
            fs.writeFileSync(fileName, content);
            return super.read(fileName);
        } catch (e) {
            throw new Error('File could not be created');
        }
    }

    abstract getKeys(): string[];
}
