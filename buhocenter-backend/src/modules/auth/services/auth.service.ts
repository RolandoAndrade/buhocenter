import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { JwtService } from '@nestjs/jwt';
import { Customer } from '../../users/entities/customer.entity';

@Injectable()
export class AuthService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly jwtService: JwtService,
    ) {}

    /**
     * Creates token for users when logging in
     * @param user objeto del usuario que se encuentra iniciando sesión
     */
    async login(user: Customer): Promise<string> {
        this.logger.debug(`login: generating token to user [uid=${user.uid}|email=${user.email}]`,
            { context: AuthService.name });

        const payload = { username: user.email, uid: user.uid };
        return this.jwtService.sign(payload);
    }
}
