import { Injectable } from '@nestjs/common';
import { WinstonModuleOptionsFactory, WinstonModuleOptions } from 'nest-winston';
import { transports, format } from 'winston';
import * as rTracer from 'cls-rtracer';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggerSettingsService implements WinstonModuleOptionsFactory {
    public createWinstonModuleOptions(): Partial<WinstonModuleOptions> {
        return {
            exitOnError: false,
            level: 'debug',
            levels: {
                error: 0,
                warn: 1,
                info: 2,
                http: 3,
                verbose: 4,
                debug: 5,
                silly: 6,
            },
            transports: [
                new transports.Console({
                    format: format.combine(
                        format.splat(),
                        format.simple(),
                        format.colorize({ message: true }),
                        format.printf(LoggerSettingsService.consoleLoggerFormat),
                    ),
                }),
                new DailyRotateFile({
                    filename: 'buhocenter-%DATE%.log',
                    datePattern: 'YYYY-MM-DD',
                    zippedArchive: true,
                    maxFiles: '7d',
                    dirname: './logs',
                    format: format.combine(
                        format.splat(),
                        format.simple(),
                        format.colorize({ message: true }),
                        format.printf(LoggerSettingsService.dailyFileLoggerFormat),
                    ),
                }),
            ],
        };
    }

    public static consoleLoggerFormat(info: any) {
        const requestId: string = rTracer.id() ? `[${rTracer.id()}]` : '';
        const tzoffset: number = new Date().getTimezoneOffset() * 60000;
        const localISOTime: string = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
        const level = format.colorize(info.level.toUpperCase());
        const context: string = info.context ? info.context : 'N/D';
        const msg = format.colorize(info.message ? info.message : '');

        return `${localISOTime} ${requestId} ${level.options} [${context}] ${msg.options}`;
    }

    public static dailyFileLoggerFormat(info: any) {
        const requestId: string = rTracer.id() ? `[${rTracer.id()}]` : '';
        const tzoffset: number = new Date().getTimezoneOffset() * 60000;
        const localISOTime: string = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
        const level = format.colorize(info.level.toUpperCase());
        const context: string = info.context ? info.context : 'N/D';
        const msg: string = info.message ? info.message : '';

        return `${localISOTime} ${requestId} ${level.options} [${context}] ${msg}`;
    }
}
