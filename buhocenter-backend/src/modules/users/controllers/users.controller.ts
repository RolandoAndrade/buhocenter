import { User } from '../entities/user.entity';
import {
    Body,
    Controller,
    Get,
    Post,
    Param,
    ParseIntPipe,
    Res,
    HttpStatus,
    Inject,
    Patch,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { GmailDto } from '../dto/GmailDto.dto';
import { ResponseAuth } from '../interfaces/ResponseAuth';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    @Patch()
    async updateUser(@Body() user: Partial<User>): Promise<User> {
        this.logger.info(`updateUser [user=${JSON.stringify(user)}]`, {
            context: UsersController.name,
        });

        return await this.usersService.updateUser(user);
    }

    @Get(':id')
    async getUserById(@Param('id', new ParseIntPipe()) id: number): Promise<User> {
        this.logger.info(`getUserById: [id=${id}]`, { context: UsersController.name });
        return await this.usersService.getUserById(id);
    }

    @Get()
    async getUsers(): Promise<User[]> {
        this.logger.info(`getUsers: fetching users...`, { context: UsersController.name });
        return await this.usersService.getUsers();
    }

    @Post('/register')
    async registerUser(@Body() user: Partial<User>): Promise<User> {
        this.logger.info(`registerUser: [uid=${user.uid}]`, { context: UsersController.name });
        return await this.usersService.registerUser(user);
    }

    @Post('/login')
    async login(@Body() data: { token: string; uid: string }, @Res() res): Promise<Response> {
        try {
            this.logger.info(`login: Logeando customer [customer=${data.uid}]|[token=${data.token}]`, {
                context: UsersController.name,
            });
            const dataResponse: any = await this.usersService.login(data);
            return res.status(HttpStatus.OK).send(dataResponse);
        } catch (e) {
            return res.status(HttpStatus.NOT_FOUND).send();
        }
    }

    @Post('/login-social')
    async loginSocial(@Body() data: GmailDto, @Res() res): Promise<Response> {
        try {
            this.logger.info(
                `loginSocial: federated login by user [uid=${data.clientData.uid}|token=${data.token}]`,
                { context: UsersController.name },
            );
            const dataResponse: ResponseAuth = await this.usersService.validateRegisterSocial(data);
            return res.status(HttpStatus.OK).send(dataResponse);
        } catch (e) {
            return res.status(HttpStatus.NOT_FOUND).send();
        }
    }

    @Post('/logout')
    async logout(@Body() data: { uid: string }, @Res() res): Promise<Response> {
        try {
            this.logger.info(`logout: user logout [uid=${data.uid}]`, {
                context: UsersController.name,
            });
            const dataResponse: {
                logout: boolean;
            } = await this.usersService.logout(data.uid);
            return res.status(HttpStatus.OK).send(dataResponse);
        } catch (e) {
            return res.status(HttpStatus.NOT_FOUND).send();
        }
    }
}
