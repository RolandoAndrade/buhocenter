import httpcustomer from './http-client';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export class HttpRepository {

    protected createHeader(): Partial<AxiosRequestConfig['headers']> {
        const token: any = localStorage.getItem('token');
        return {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            }
        }
    }

    protected createUri(
        path: string[],
        queryString?: Object | any
    ): string {
        let uri: string = '';

        if (path) {
            uri += '/' + path.join('/');
        }

        if (queryString) {
            uri += '?';
            const query: string[] = [];

            for (const [key, value] of Object.entries(queryString)) {
                query.push(`${key}=${value}`);
            }

            uri += query.join('&');
        }

        return uri;
    }

    protected post(uri: string,
        data: AxiosRequestConfig['data'],
        header?: AxiosRequestConfig['headers'],
    ): Promise<AxiosResponse<any>> {
        return httpcustomer.post(uri, data, header);
    }

    protected get(uri: string, header?: AxiosRequestConfig['headers'],): Promise<AxiosResponse<any>> {
        return httpcustomer.get(uri, header);
    }

    protected patch(uri: string,
        data: AxiosRequestConfig['data'],
        header?: AxiosRequestConfig['headers']
    ): Promise<AxiosResponse<any>> {
        return httpcustomer.patch(uri, data, header);
    }

    protected delete(uri: string, header?: AxiosRequestConfig['headers']): Promise<AxiosResponse<any>> {
        return httpcustomer.delete(uri, header);
    }
}