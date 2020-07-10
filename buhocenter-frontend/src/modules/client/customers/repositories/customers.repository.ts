import { HttpRepository } from '@/http/http.repository';

class CustomersRepository extends HttpRepository {
    private static readonly RESOURCE = 'users';

    public async updateCustomer(user) {
        return await this.patch(this.createUri([`${CustomersRepository.RESOURCE}`]), user);
    }

    public async downloadFile(id: number): Promise<boolean> {
        const response = await this.get(this.createUri([`products/facture/view/${id}`]));
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.setAttribute('download', 'invoice.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
    }
}

export default new CustomersRepository();
