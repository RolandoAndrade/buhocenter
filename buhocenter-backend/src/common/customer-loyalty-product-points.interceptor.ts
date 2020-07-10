import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerLoyaltyService } from '../modules/third-party/services/customer-loyalty.service';
import { AuthService } from '../modules/auth/services/auth.service';
import { UsersService } from '../modules/users/services/users.service';
import { User } from '../modules/users/entities/user.entity';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class CustomerLoyaltyInterceptor implements NestInterceptor {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly authService: AuthService,
        private readonly customerLoyaltyService: CustomerLoyaltyService,
        private readonly usersService: UsersService,
    ) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        let isMemberOfCustomerLoyaltySystem: string | undefined = undefined;
        let user: User;

        if (request.headers.authorization) {
            const token: string = request.headers.authorization.split(' ')[1];
            if (token) {
                const payload = await this.authService.decodeToken(token.replace('"', '').slice(0, -1));
                user = await this.usersService.getUserByUuid(payload.uid);
                if (user) {
                    isMemberOfCustomerLoyaltySystem = user.loyaltySystemToken;
                }
            }
        }

        return next.handle().pipe(
            map(async value => {
                try {
                    if (isMemberOfCustomerLoyaltySystem && request.headers.authorization) {
                        if (value.products && Array.isArray(value.products)) {
                            value.products = await this.customerLoyaltyService.getProductsAccumulatedPoints(
                                value.products,
                                user.loyaltySystemToken,
                            );
                        } else if (Array.isArray(value)) {
                            await this.customerLoyaltyService.getProductsAccumulatedPoints(
                                value,
                                user.loyaltySystemToken,
                            );
                        } else {
                            await this.customerLoyaltyService.getProductsAccumulatedPoints(
                                [value],
                                user.loyaltySystemToken,
                            );
                        }
                    }
                } catch (ex) {
                    this.logger.error(
                        `CustomerLoyaltyInterceptor: error fetching tentative points [e=${JSON.stringify(
                            ex,
                        )}]`,
                        {
                            context: CustomerLoyaltyInterceptor.name,
                        },
                    );
                } finally {
                    return value;
                }
            }),
        );
    }
}
