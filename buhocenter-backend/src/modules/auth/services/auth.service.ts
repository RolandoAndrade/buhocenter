import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/user.entity';

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
    public async login(user: User): Promise<string> {
        this.logger.debug(`login: generating token to user [uid=${user.uid}|email=${user.email}]`, {
            context: AuthService.name,
        });
        if (!user.id || !user.email) {
            throw new BadRequestException('Must specify id and email');
        }
        const payload = { username: user.email, uid: user.uid };
        return this.jwtService.sign(payload);
    }

    /**
     * Decodes token using jwtService provided by Nest.
     * @param token string.
     */
    public async decodeToken(token: string): Promise<any> {
        return this.jwtService.decode(token);
    }
}
