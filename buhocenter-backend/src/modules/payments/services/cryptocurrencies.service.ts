import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cryptocurrency } from '../entities/cryptocurrency.entity';

@Injectable()
export class CryptocurrenciesService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly _logger: Logger,
        @InjectRepository(Cryptocurrency)
        private readonly _cryptocurrencyRepository: Repository<Cryptocurrency>,
    ) {}

    /**
     * getCryptotocurrencyByIso
     * @param iso: string
     * @retuns Promise<Cryptocurrency>
     */
    async getCryptotocurrencyByIso(iso: string): Promise<Cryptocurrency> {
        this._logger.debug(`getCryptotocurrencyByIso: Getting a cryptocurrency by ISO code [iso=${iso}]`, {
            context: CryptocurrenciesService.name,
        });

        return await this._cryptocurrencyRepository.findOne({ iso: iso });
    }
}
