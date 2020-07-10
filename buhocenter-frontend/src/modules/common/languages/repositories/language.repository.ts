import { HttpRepository } from '@/http/http.repository';

class LanguageRepository extends HttpRepository {
    public async getLanguages(): Promise<any> {
        try {
            const response = await this.get(this.createUri(['languages'], false));
            if (response) {
                return response;
            }
            return false;
        } catch (e) {
            return { error: e.message };
        }
    }

    public async setLanguage(code: string): Promise<any> {
        try {
            const response = await this.get(this.createUri([`languages/terms/${code}`], false));
            if (response) {
                return response;
            }
            return { error: 'Error encontrando idioma' };
        } catch (e) {
            return { error: e.message };
        }
    }
}

export default new LanguageRepository();
