import { StatusService } from '../services/status.service';
import { Test, TestingModule } from '@nestjs/testing';
import { WinstonModule } from 'nest-winston';
import { LoggerSettingsService } from '../../settings/services/logger.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockFunctionInterface, repositoryMockFactory } from '../../../../test/mock.functions';
import { STATUS } from '../../../config/constants';
import { Status } from '../entities/status.entity';
import { StatusHistory } from '../entities/status-history.entity';
import { statusMockDB } from './mocks/status.mock';

describe('status service', () => {
    let service: StatusService;
    let statusRepository: MockFunctionInterface;
    let statusHistoryRepository: MockFunctionInterface;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StatusService,
                {
                    provide: getRepositoryToken(Status),
                    useFactory: repositoryMockFactory,
                },
                {
                    provide: getRepositoryToken(StatusHistory),
                    useFactory: repositoryMockFactory,
                },
            ],
            imports: [
                WinstonModule.forRootAsync({
                    useClass: LoggerSettingsService,
                }),
            ],
        }).compile();
        service = module.get(StatusService);
        statusRepository = module.get(getRepositoryToken(Status));
        statusHistoryRepository = module.get(getRepositoryToken(StatusHistory));
    });

    describe('get status', () => {
        it('must return the status by id', async () => {
            statusRepository.findOne.mockResolvedValue(statusMockDB[0]);
            expect((await service.getStatusById(1)).id).toEqual(STATUS.ACTIVE.id);
            statusRepository.findOne.mockResolvedValue(statusMockDB[1]);
            expect((await service.getStatusById(2)).id).toEqual(STATUS.INACTIVE.id);
            statusRepository.findOne.mockResolvedValue(statusMockDB[2]);
            expect((await service.getStatusById(3)).id).toEqual(STATUS.NEW.id);
            statusRepository.findOne.mockResolvedValue(statusMockDB[3]);
            expect((await service.getStatusById(4)).id).toEqual(STATUS.PENDING.id);
            statusRepository.findOne.mockResolvedValue(statusMockDB[4]);
            expect((await service.getStatusById(5)).id).toEqual(STATUS.CONFIRMING.id);
            statusRepository.findOne.mockResolvedValue(statusMockDB[5]);
            expect((await service.getStatusById(6)).id).toEqual(STATUS.PAID.id);
        });
        it('if not found, must return undefined', async () => {
            statusRepository.findOne.mockResolvedValue(undefined);
            expect(await service.getStatusById(1000)).toBeUndefined();
            expect(await service.getStatusById(undefined)).toBeUndefined();
        });
    });

    describe('create status history', () => {
        let transactions;

        beforeEach(() => {
            transactions = {
                getRepository() {
                    return statusHistoryRepository;
                },
            };
        });

        it('must try to save a status history', async () => {
            const statusHistory: StatusHistory = {
                payment: { id: 1 },
                status: { id: 1 },
            } as StatusHistory;
            await service.createStatusHistory(statusHistory, transactions);
            expect(statusHistoryRepository.save).toBeCalled();
        });

        it('must return an error if it cannot be inserted', async () => {
            const statusHistory: StatusHistory = {
                payment: { id: 1 },
                status: { id: undefined },
            } as StatusHistory;
            statusHistoryRepository.save.mockImplementation(() => {
                throw new Error('Error inserting');
            });
            const r = async () => await service.createStatusHistory(statusHistory, transactions);
            expect(statusHistoryRepository.save).toThrow(new Error('Error inserting'));
        });
    });

    describe('get status by checkout and status', () => {
        let transactions;

        beforeEach(() => {
            transactions = {
                getRepository() {
                    return statusHistoryRepository;
                },
            };
        });

        it('must return the status history', async () => {
            statusHistoryRepository.findOne.mockResolvedValue({ id: 1 });
            const r = await service.getStatusHistoryByCheckoutIdAndStatusId(1, 1);
            expect(r.id).toEqual(1);
        });

        it('must return undefined if not found', async () => {
            statusHistoryRepository.findOne.mockResolvedValue(undefined);
            expect(await service.getStatusHistoryByCheckoutIdAndStatusId(1, 7)).toBeUndefined();
            expect(
                await service.getStatusHistoryByCheckoutIdAndStatusId(undefined, undefined),
            ).toBeUndefined();
        });
    });
});
