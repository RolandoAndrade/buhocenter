import { HttpRepository } from '@/http/http.repository';
import { PetromilesAuth } from '../interfaces/petromilesAuth.interface';

class PetromilesAuthRepository extends HttpRepository {
    private static readonly RESOURCE = 'third-party';

    authorize(petromiles: PetromilesAuth): Promise<boolean> {
        return this.post(
            this.createUri([`${PetromilesAuthRepository.RESOURCE}`, 'authorize']),
            petromiles,
            this.createHeader(),
        );
    }

    authorizeCode(petromiles: PetromilesAuth): Promise<boolean> {
        return this.post(
            this.createUri([`${PetromilesAuthRepository.RESOURCE}`, 'authorize-code']),
            petromiles,
            this.createHeader(),
        );
    }

    verifyUser(petromiles: PetromilesAuth): Promise<boolean> {
        return this.get(
            this.createUri([
                `${PetromilesAuthRepository.RESOURCE}/loyalty-associated-account?userId=${petromiles.id}`,
            ]),
            this.createHeader(),
        );
    }

    async generateCsv(): Promise<boolean> {
        const fileName: string = new Date().toISOString();
        const response = await this.post(
            this.createUri([`${PetromilesAuthRepository.RESOURCE}/clients-csv`]),
            {
                name: fileName,
            },
            this.createHeader(),
        );
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName+'.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
    }
}

export default new PetromilesAuthRepository();
