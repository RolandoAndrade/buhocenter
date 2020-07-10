import {
    Injectable,
    Inject,
    InternalServerErrorException,
    NotFoundException,
    BadRequestException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { GmailDto } from '../dto/GmailDto.dto';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { ResponseAuth } from '../interfaces/ResponseAuth';
import { STATUS, ROLE, LANGUAGE, FOREIGN_EXCHANGES } from '../../../config/constants';
import { AuthService } from '../../auth/services/auth.service';
import { EmailsService } from '../../notifications/services/emails.service';

@Injectable()
export class UsersService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectRepository(User) private usersRepository: Repository<User>,
        private readonly emailsService: EmailsService,
        private readonly authService: AuthService,
    ) {}

    /**
     * Returns the customer found by the parameter received
     * @param uid parameter to obtain the customer
     */
    async getUserByUuid(uid: string): Promise<User> {
        this.logger.debug(`login: customer exists [uid=${uid}]`, {
            context: UsersService.name,
        });

        return await this.usersRepository.findOne({
            where: { uid },
            relations: ['status'],
        });
    }

    /**
     * Updates user information
     * @param user represents the user entity which will be modified
     * @returns Promise<User>
     */
    public async updateUser(user: Partial<User>): Promise<User> {
        this.logger.debug(`updateUser: update user information [user=${JSON.stringify(user)}]`, {
            context: UsersService.name,
        });
        return await this.usersRepository.save(user);
    }

    /**
     * This method allows you to create customers and additionally,
     * it sends the welcome mail to our platform
     * @param data customer entity which will be registered
     */
    async registerUser(user: Partial<User>): Promise<User> {
        this.logger.debug(`registerUser: creating user [user=${JSON.stringify(user)}]`, {
            context: UsersService.name,
        });

        try {
            const userCreated: User = await this.usersRepository.save(user);
            await this.emailsService.sendEmailWelcome(user.email, user.name);

            this.logger.debug(`registerUser: user created! [id=${userCreated.id}]`, {
                context: UsersService.name,
            });

            return userCreated;
        } catch (e) {
            this.logger.error(`registerUser: error creating customer [error=${e.message}]`, {
                context: UsersService.name,
            });
            throw new InternalServerErrorException('Error creating user');
        }
    }

    /**
     * This method allows you to login to the platform giving the customer
     * the necessary credentials to access to our API
     * @param data object that contains the token and uid given by firebase
     */
    async login(data: { token: string; uid: string }): Promise<any> {
        const customer: User = await this.getUserByUuid(data.uid);
        let customerSave: User;
        let response: ResponseAuth;
        if (customer) {
            if (customer.status.id === STATUS.INACTIVE.id) {
                throw new UnauthorizedException('The user cannot enter to the system because are inactive');
            }
            const newcustomer: User = this.usersRepository.merge(customer, {
                token: data.token,
            });
            customerSave = await this.usersRepository.save(newcustomer);
            customerSave = await this.usersRepository.findOne({
                where: { id: customerSave.id },
                relations: ['role', 'addresses'],
            });
            response = {
                apiAccessToken: await this.authService.login(customerSave),
                token: customerSave.token,
                data: {
                    id: customerSave.id,
                    name: customerSave.name,
                    lastName: customerSave.lastName,
                    uid: customerSave.uid,
                    email: customerSave.email,
                    cellphone: customerSave.cellphone,
                    is_federate: customerSave.is_federate,
                    status: customerSave.status,
                    role: customerSave.role,
                    birthDate: customerSave.birthdate,
                    language: customerSave.language,
                    addresses: customerSave.addresses.filter(
                        i => i.status && i.status.id === STATUS.ACTIVE.id,
                    ),
                },
            };
            this.logger.debug(`login: customer exist [id=${customer.id}]`, {
                context: UsersService.name,
            });
            return response;
        }
        this.logger.error(`login: customer not exist [uid=${data.uid}]`, {
            context: UsersService.name,
        });
        return false;
    }

    /**
     * Returns the user according to the given id
     * @param id user id
     * @returns Promise<User>
     */
    public async getUserById(id: number): Promise<User> {
        this.logger.debug(`getUserById: returning user by id [id=${id}]`);

        return await this.usersRepository.findOne(id);
    }

    /**
     * Returns the users saved
     * @returns Promise<User[]>
     */
    public async getUsers(): Promise<User[]> {
        this.logger.debug(`getUsers: returning users`);

        return await this.usersRepository.find({
            relations: ['role', 'status'],
            order: {
                id: 'ASC',
            },
        });
    }

    /**
     * Funcion para registrar e iniciar sesion con gmail o facebook
     * @param data DTO con datos necesarios para registrar customers con gmail o facebook
     * @promise ResponseAuth objeto de respuesta de autenticacion
     */
    async validateRegisterSocial(data: GmailDto): Promise<ResponseAuth> {
        try {
            const customer: User = await this.getUserByUuid(data.clientData.uid);
            let customerSave: User;
            let response: ResponseAuth;
            if (customer) {
                if (customer.status.id === STATUS.INACTIVE.id) {
                    throw new UnauthorizedException(
                        'The user cannot enter to the system because are inactive',
                    );
                }
                const newcustomer: User = this.usersRepository.merge(customer, {
                    token: data.token,
                    is_federate: true,
                });
                customerSave = await this.usersRepository.save(newcustomer);
                customerSave = await this.usersRepository.findOne({
                    where: { id: customerSave.id },
                    relations: ['role', 'addresses'],
                });
                this.logger.debug(`validateRegisterSocial: customer exist [id=${newcustomer.id}]`, {
                    context: UsersService.name,
                });
            } else {
                // @ts-ignore
                customerSave = await this.usersRepository.save({
                    name: data.clientData.first_name,
                    lastName: data.clientData.last_name,
                    uid: data.clientData.uid,
                    email: data.clientData.email,
                    token: data.token,
                    is_federate: true,
                    foreignExchange: { id: FOREIGN_EXCHANGES.USD.id },
                    status: {
                        id: STATUS.ACTIVE.id,
                    },
                    role: {
                        id: ROLE.CUSTOMER.id,
                    },
                    language: LANGUAGE.ENGLISH.id,
                });
                customerSave = await this.usersRepository.findOne({
                    where: { id: customerSave.id },
                    relations: ['role', 'addresses'],
                });
                this.logger.debug(`validateRegisterSocial: New customer registered [id=${customerSave.id}]`, {
                    context: UsersService.name,
                });
                await this.emailsService.sendEmailWelcome(data.clientData.email, data.clientData.first_name);
            }
            response = {
                apiAccessToken: await this.authService.login(customerSave),
                token: customerSave.token,
                data: {
                    id: customerSave.id,
                    name: customerSave.name,
                    lastName: customerSave.lastName,
                    email: customerSave.email,
                    uid: customerSave.uid,
                    status: customerSave.status,
                    role: { ...customerSave.role },
                    is_federate: customerSave.is_federate,
                    cellphone: customerSave.cellphone,
                    birthDate: customerSave.birthdate,
                    language: customerSave.language,
                    addresses: customerSave.addresses.filter(
                        i => i.status && i.status.id === STATUS.ACTIVE.id,
                    ),
                },
            };
            return response;
        } catch (e) {
            this.logger.error(`validateRegisterSocial: error message [e=${e.message}]`, {
                context: UsersService.name,
            });
        }
    }

    /**
     * Funcion para deslogear y borrar token en el customer
     * @param data string que trae el UID del usuario a ser deslogeado
     */
    async logout(data: string): Promise<{ logout: boolean }> {
        const customer: User = await this.usersRepository.findOne({
            where: {
                uid: data,
            },
        });
        let response: { logout: boolean };
        if (customer) {
            const newcustomer: User = this.usersRepository.merge(customer, {
                token: '',
            });
            await this.usersRepository.save(newcustomer);
            this.logger.debug(`logout: loguot success, customer [id=${data}]`, {
                context: UsersService.name,
            });
            response = {
                logout: true,
            };
        } else {
            this.logger.error(`logout: loguot error, customer [id=${data}]`, {
                context: UsersService.name,
            });
            response = {
                logout: false,
            };
        }
        return response;
    }

    /**
     * getUserByAddress
     * @param addressId: number
     * @returns Promise<User>
     */
    async getUserByAddress(addressId: number): Promise<User> {
        this.logger.debug(`getUserByAddress: Getting a user by its address [addressId=${addressId}]`, {
            context: UsersService.name,
        });

        return await this.usersRepository
            .createQueryBuilder('user')
            .innerJoin('user.addresses', 'addresses')
            .where('addresses.id = :addressId', { addressId: addressId })
            .getOne();
    }
}
