import { Customer } from '../entities/customer.entity';
import {Body, Controller, Get, Post, Param, ParseIntPipe, Res, HttpStatus, Inject, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { GmailDto } from '../dto/GmailDto.dto';
import { ResponseAuth } from '../interfaces/ResponseAuth';
import { CustomerDto } from '../dto/Customer.dto';
import { ResponseRegister } from '../interfaces/ResponseRegister';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    ) {}

    @Patch()
    async updateCustomer(
        @Body() customer: Partial<Customer>,
        @Res() res,
    ): Promise<Response> {
        this.logger.info(`updateCustomer [customer=${JSON.stringify(customer)}]`, { context: UsersController.name });

        try {
            return res.status(HttpStatus.OK).send(await this.usersService.updateCustomer(customer));
        } catch(e) {
            return res.status(HttpStatus.BAD_REQUEST).send();
        }
    }

    @Get(':id')
    async getHello(@Param('id', new ParseIntPipe()) id: number): Promise<number> {
        return this.usersService.getUsers(id);
    }

    @Post('/register')
    async register(@Body() data: CustomerDto, @Res() res): Promise<Response> {
        try {
            this.logger.info(`
            register: registrando customer [uid=${data.uid}]`,
                { context: UsersController.name },
            );
            const dataResponse: ResponseRegister = await this.usersService.registerCustomer(data);
            return res.status(HttpStatus.CREATED).send(dataResponse);
        } catch (e) {
            return res.status(HttpStatus.NOT_FOUND).send();
        }
    }

    @Post('/login')
    async login(@Body() data: { token: string, uid: string }, @Res() res): Promise<Response> {
        try {
            this.logger.info(`
            login: Logeando customer [customer=${data.uid}]|[token=${data.token}]`,
                { context: UsersController.name },
            );
            const dataResponse: any = await this.usersService.login(data);
            return res.status(HttpStatus.OK).send(dataResponse);
        } catch (e) {
            return res.status(HttpStatus.NOT_FOUND).send();
        }
    }

    @Post('/login-social')
    async loginSocial(@Body() data: GmailDto, @Res() res): Promise<Response> {
        try {
            this.logger.info(`
            loginSocial: Logeando customer con gmail o facebook [uid=${data.clientData.uid}] | [token=${data.token}]`,
                { context: UsersController.name },
            );
            const dataResponse: ResponseAuth = await this.usersService.validateRegisterSocial(data);
            return res.status(HttpStatus.OK).send(dataResponse);
        } catch (e) {
            return res.status(HttpStatus.NOT_FOUND).send();
        }
    }

    @Post('/logout')
    async logout(@Body() data: { uid: string; }, @Res() res): Promise<Response> {
        try {
            this.logger.info(`logout: Logout de customer [uid=${data.uid}]`,
                { context: UsersController.name },
            );
            const dataResponse: { logout: boolean; } = await this.usersService.logout(data.uid);
            return res.status(HttpStatus.OK).send(dataResponse);
        } catch (e) {
            return  res.status(HttpStatus.NOT_FOUND).send();
        }
    }

}
