import { Address } from '../../entities/address.entity';
import { User } from '../../../users/entities/user.entity';
import { Status } from '../../../status/entities/status.entity';
import { Payment } from '../../../payments/entities/payment.entity';

function createAddress(
    id: number,
    firstStreet: string,
    secondStreet: string,
    city: string,
    state: string,
    zipcode: number,
    setDefault: boolean,
    user: User | {},
    status: Status | {},
    payments: Payment[] | [],
): Address {
    return {
        id,
        firstStreet,
        secondStreet,
        city,
        state,
        zipcode,
        setDefault,
        user,
        status,
        payments,
        createdAt: new Date(),
        updatedAt: new Date(),
    } as Address;
}

export const addressDB: Address[] = [
    createAddress(1, 'Street A', 'AV. A', 'City A', 'State A', 1, true, {}, {}, []),
    createAddress(2, 'Street B', 'AV. B', 'City B', 'State B', 2, false, {}, {}, []),
    createAddress(3, 'Street C', 'AV. C', 'City C', 'State C', 3, true, {}, {}, []),
];
