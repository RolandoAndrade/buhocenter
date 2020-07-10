import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Address } from '../../address/entities/address.entity';
import { Cryptocurrency } from './cryptocurrency.entity';
import { Commission } from './commission.entity';
import { ForeignExchange } from '../../users/entities/foreign-exchange.entity';
import { StatusHistory } from '../../status/entities/status-history.entity';
import { Cart } from '../../carts/entities/cart.entity';
import { SYNCHRONIZATION_STATUS } from '../../../config/constants';

@Entity('payments')
export class Payment extends PrimalEntity {
    @Column({ type: 'decimal', nullable: false })
    total: number;

    @Column({ name: 'total_cryptocurrency', type: 'decimal', nullable: true })
    totalCryptocurrency: number;

    @Column({ name: 'transaction_id', type: 'integer', nullable: true })
    transaction: number;

    @Column({ name: 'tracking_url', type: 'text', nullable: true })
    trackingUrl: number;

    @Column({ name: 'loyalty_system_confirmation_id', type: 'text', nullable: true })
    loyaltySystemConfirmationId: string;

    @Column({ name: 'loyalty_system_date', type: 'text', nullable: true })
    loyaltySystemDate: string;

    @Column({ name: 'loyalty_system_amount', type: 'text', nullable: true })
    loyaltySystemAmount: string;

    @Column({ name: 'loyalty_system_commission', type: 'text', nullable: true })
    loyaltySystemCommission: string;

    @Column({ name: 'loyalty_system_points', type: 'text', nullable: true })
    loyaltySystemPoints: string;

    @Column({
        name: 'loyalty_sync_status',
        type: 'text',
        default: SYNCHRONIZATION_STATUS.WITHOUT_NOTIFICATION,
    })
    loyaltySyncStatus: string;

    @Column({ name: 'file_with_loyalty_sync_data', type: 'text', nullable: true })
    fileWithLoyaltySyncData: string;

    @JoinColumn({ name: 'address_id' })
    @ManyToOne(
        type => Address,
        address => address.payments,
        { nullable: false },
    )
    address: Address;

    @JoinColumn({ name: 'foreign_exchange_id' })
    @ManyToOne(
        type => ForeignExchange,
        foreignExchange => foreignExchange.payments,
        { nullable: false },
    )
    foreignExchange: ForeignExchange;

    @JoinColumn({ name: 'cryptocurrency_id' })
    @ManyToOne(
        type => Cryptocurrency,
        cryptocurrency => cryptocurrency.payments,
        { nullable: true },
    )
    cryptocurrency: Cryptocurrency;

    @JoinColumn({ name: 'commision_id' })
    @ManyToOne(
        type => Commission,
        commission => commission.payments,
        { nullable: false },
    )
    commission: Commission;

    @OneToMany(
        type => StatusHistory,
        statusHistories => statusHistories.payment,
        { cascade: true },
    )
    statusHistories: StatusHistory[];

    @OneToMany(
        type => Cart,
        carts => carts.payment,
    )
    carts: Cart[];
}
