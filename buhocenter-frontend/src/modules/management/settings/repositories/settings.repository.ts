import { HttpRepository } from '@/http/http.repository';
import { Commission } from '../interfaces/commissions.interface';

class SettingsRepository extends HttpRepository {
    private static readonly RESOURCE = 'commissions';

    getCommissions(): Promise<Array<Commission>> {
        return this.get(this.createUri([`${SettingsRepository.RESOURCE}`]), this.createHeader());
    }

    createCommission(commission: Commission): Promise<boolean> {
        return this.post(this.createUri([`${SettingsRepository.RESOURCE}`]), commission, this.createHeader());
    }
}

export default new SettingsRepository();
