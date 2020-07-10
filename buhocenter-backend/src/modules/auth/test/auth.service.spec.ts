import { AuthService } from '../services/auth.service';
import { Test } from '@nestjs/testing';
import { User } from '../../users/entities/user.entity';
import { authMockModuleMetadata } from './mocks/auth.mock';

describe('auth service', () => {
    let service: AuthService;

    beforeEach(async () => {
        process.env.JWT_SECRET = 'key4test';
        process.env.JWT_EXPIRES_IN = '60s';
        const module = await Test.createTestingModule(authMockModuleMetadata).compile();
        service = module.get(AuthService);
    });

    describe('login', () => {
        it('must return the token', async () => {
            const r = await service.login({ id: 1, uid: '1', email: 'a@a.com' } as User);
            expect(r.length).toBeGreaterThan(20);
        });

        it('must return an error', async () => {
            try {
                await service.login({ id: 1, uid: '1', email: undefined } as User);
                fail('Must return an error');
            } catch (e) {
                expect(e.message.statusCode).toEqual(400);
                expect(e.message.message).toEqual('Must specify id and email');
            }

            try {
                await service.login({ id: undefined, uid: '1', email: 'a@a.com' } as User);
                fail('Must return an error');
            } catch (e) {
                expect(e.message.statusCode).toEqual(400);
                expect(e.message.message).toEqual('Must specify id and email');
            }
        });
    });
});
