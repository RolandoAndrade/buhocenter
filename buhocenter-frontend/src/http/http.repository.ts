import httpcustomer from './http-client';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

export class HttpRepository {
    protected createHeader(): Partial<AxiosRequestConfig['headers']> {
        const token: string | null = localStorage.getItem('token');

        let headers;

        if (token) {
            headers = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
        }

        return headers;
    }

    protected createUri(path: string[], queryString?: Record<string, any> | any): string {
        let uri = '';

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

    protected post(
        uri: string,
        data: AxiosRequestConfig['data'],
        header?: AxiosRequestConfig['headers'],
    ): Promise<any> {
        return httpcustomer.post(uri, data, header);
    }

    protected get(uri: string, header?: AxiosRequestConfig['headers']): Promise<any> {
        return httpcustomer.get(uri, header);
    }

    protected patch(
        uri: string,
        data: AxiosRequestConfig['data'],
        header?: AxiosRequestConfig['headers'],
    ): Promise<any> {
        return httpcustomer.patch(uri, data, header);
    }

    protected put(
        uri: string,
        data: AxiosRequestConfig['data'],
        header?: AxiosRequestConfig['headers'],
    ): Promise<any> {
        return httpcustomer.put(uri, data, header);
    }

    protected delete(uri: string, header?: AxiosRequestConfig['headers']): Promise<any> {
        return httpcustomer.delete(uri, header);
    }
}
