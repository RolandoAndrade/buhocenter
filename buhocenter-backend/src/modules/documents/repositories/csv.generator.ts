import { ReadStream } from 'fs';
import * as fs from 'fs';
import { NotFoundException } from '@nestjs/common';

export abstract class CsvGenerator {
    abstract generate(data: Array<{ [key: string]: any }>, fileName?: string): ReadStream;
    read(fileName: string): ReadStream {
        let rs: ReadStream | NotFoundException = fs.createReadStream(fileName);
        return rs;
    }
}
