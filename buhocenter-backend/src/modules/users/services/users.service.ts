import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { SendGridService } from '@anchan828/nest-sendgrid';
import {GmailDto} from '../dto/GmailDto.dto';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import {ResponseAuth} from '../interfaces/ResponseAuth';
import { STATUS, ROLE, LANGUAGE } from '../../../config/constants';
import {CustomerDto} from '../dto/Customer.dto';
import {ResponseRegister} from '../interfaces/ResponseRegister';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class UsersService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectRepository(Customer) private customerRepository: Repository<Customer>,
        private readonly sendGrid: SendGridService,
        private readonly authService: AuthService,
    ) {}

    /**
     * Returns the customer found by the parameter received
     * @param uid parameter to obtain the customer
     */
    async getUserByUuid(uid: string): Promise<Customer> {
        this.logger.debug(`login: customer exists [uid=${uid}]`, { context: UsersService.name } );

        return await this.customerRepository.findOne({
            where: { uid },
        });
    }

    /**
     * Updates customer information
     * @param customer represents the customer entity which will be modified
     * @returns Promise<Customer>
     */
    public async updateCustomer(customer: Partial<Customer>): Promise<Customer> {
        this.logger.debug(`updateCustomer: update customer information [customer=${
            JSON.stringify(customer)}]`, { context: UsersService.name } );
        return await this.customerRepository.save(customer);
    }

    /**
     * Send the welcome email to the customer
     * @param data customer entity to send the email
     * @returns Promise<boolean>
     */
    async sendEmailWelcome(data: { email: string; name: string; }): Promise<boolean> {
        try {
            const response = await this.sendGrid.send({
                to: data.email,
                from: 'buhocenter@gmail.com',
                subject: 'Welcome to buhocenter',
                templateId: 'd-4aa3a2d7aca54bdaa2688806f2401864',
                // @ts-ignore
                dynamic_template_data: {
                    name: data.name,
                },
            });
            this.logger.debug(`sendEmailWelcome: email sended [email=${data.email}]`, { context: UsersService.name } );
            return true;
        } catch (e) {
            this.logger.debug(`sendEmailWelcome: catch error email [email=${data.email}]`, { context: UsersService.name } );
            return false;
        }
    }

    /**
     * This method allows you to create customers and additionally,
     * it sends the welcome mail to our platform
     * @param data customer entity which will be registered
     */
    async registerCustomer(data: CustomerDto): Promise<ResponseRegister> {
        this.logger.debug(`registerCustomer: creating customer [customer=${JSON.stringify(data)}]`,
            { context: UsersService.name } );

        try {
            let response: ResponseRegister;
            const customerSave: Customer = await this.customerRepository.save({
                name: data.name,
                lastName: data.lastname,
                uid: data.uid,
                email: data.email,
                birthdate: data.birthdate,
                language:  data.language,
                is_federate: false,
                status: {
                    id: STATUS.ACTIVE.id,
                },
                role: {
                    id: ROLE.CUSTOMER.id,

                },
            });
            await this.sendEmailWelcome({email: data.email, name: data.name});
            this.logger.debug(`registerCustomer: user created! [id=${customerSave.id}]`, { context: UsersService.name } );
            response = { message: 'Created' };
            return response;
        } catch (e) {
            this.logger.error(`registerCustomer: error creating customer [error=${e.message}]`, { context: UsersService.name } );
            return { message: 'Error creating customer' };
        }
    }

    /**
     * This method allows you to login to the platform giving the customer
     * the necessary credentials to access to our API
     * @param data object that contains the token and uid given by firebase
     */
    async login(data: { token: string, uid: string }): Promise<any> {
        const customer: Customer = await this.getUserByUuid(data.uid);
        let customerSave: Customer;
        let response: ResponseAuth;
        if ( customer ) {
            const newcustomer: Customer = this.customerRepository.merge(customer, {
                token: data.token,
            });
            customerSave = await this.customerRepository.save(newcustomer);
            customerSave = await this.customerRepository.findOne({
                where: { id: customerSave.id },
                relations: [
                    'role',
                    'addresses',
                ],
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
                    is_federate: customerSave.is_federate,
                    status: customerSave.status,
                    role: customerSave.role,
                    birthDate: customerSave.birthdate,
                    language: customerSave.language,
                    addresses: customerSave.addresses.filter((i) => i.status && i.status.id === STATUS.ACTIVE.id),
                },
            };
            this.logger.debug(`login: customer exist [id=${customer.id}]`, { context: UsersService.name } );
            return response;
        }
        this.logger.error(`login: customer not exist [uid=${data.uid}]`, { context: UsersService.name } );
        return false;
    }

    async getUsers(id: number): Promise<number> {
        this.logger.debug(`getUsers: obteniendo el id del usuario [id=${id}|env=${process.env.ROPSTEN_TESTNET_API_KEY}]`);
        this.logger.error(`getUsers: obteniendo el id del usuario [id=${id}]`, { context: UsersService.name } );
        return id;
    }

    /**
     * Funcion para registrar e iniciar sesion con gmail o facebook
     * @param data DTO con datos necesarios para registrar customers con gmail o facebook
     * @promise ResponseAuth objeto de respuesta de autenticacion
     */
    async validateRegisterSocial(data: GmailDto): Promise<ResponseAuth> {
        try {
            const customer: Customer = await this.getUserByUuid(data.clientData.uid);
            let customerSave: Customer;
            let response: ResponseAuth;
            if ( customer ) {
                const newcustomer: Customer = this.customerRepository.merge(customer, {
                    token: data.token, is_federate: true,
                });
                customerSave = await this.customerRepository.save(newcustomer);
                customerSave = await this.customerRepository.findOne({
                    where: { id: customerSave.id },
                    relations: [
                        'role',
                        'addresses',
                    ],
                });
                this.logger.debug(`validateRegisterSocial: customer exist [id=${newcustomer.id}]`, { context: UsersService.name } );
            } else {
                // @ts-ignore
                customerSave = await this.customerRepository.save({
                    name: data.clientData.first_name,
                    lastName: data.clientData.last_name,
                    uid: data.clientData.uid,
                    email: data.clientData.email,
                    token: data.token,
                    is_federate: true,
                    status: {
                        id: STATUS.ACTIVE.id,
                    },
                    role: {
                        id: ROLE.CUSTOMER.id,
                    },
                    language:  LANGUAGE.ENGLISH.id,
                });
                customerSave = await this.customerRepository.findOne({
                    where: { id: customerSave.id },
                    relations: [
                        'role',
                        'addresses',
                    ],
                });
                this.logger.debug(`validateRegisterSocial: New customer registered [id=${customerSave.id}]`, { context: UsersService.name } );
                await this.sendEmailWelcome({email: data.clientData.email, name: data.clientData.first_name});
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
                    role: {...customerSave.role},
                    is_federate: customerSave.is_federate,
                    birthDate: customerSave.birthdate,
                    language: customerSave.language,
                    addresses: customerSave.addresses.filter((i) => i.status && i.status.id === STATUS.ACTIVE.id),
                },

            };
            return response;
        } catch (e) {
            this.logger.error(`validateRegisterSocial: error message [e=${e.message}]`, { context: UsersService.name } );
        }
    }

    /**
     * Funcion para deslogear y borrar token en el customer
     * @param data string que trae el UID del usuario a ser deslogeado
     */
    async logout(data: string): Promise<{ logout: boolean; }> {
        const customer: Customer =   await this.customerRepository.findOne({
            where: {
                uid: data,
            },
        });
        let response: { logout: boolean; };
        if (customer) {
            const newcustomer: Customer = this.customerRepository.merge(customer, {
                token: '',
            });
            await this.customerRepository.save(newcustomer);
            this.logger.debug(`logout: loguot success, customer [id=${data}]`, { context: UsersService.name } );
            response = {
                logout: true,
            };
        } else {
            this.logger.error(`logout: loguot error, customer [id=${data}]`, { context: UsersService.name } );
            response = {
                logout: false,
            };
        }
        return response;
    }

    async findUser(UserID: number): Promise<Customer> {
        return await this.customerRepository.findOne(UserID);
    }
}