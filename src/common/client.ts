import { env } from './env';

type ApiMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
type ApiPath = '/api/echo';

const baseUrl = `http://localhost:${env.PORT}`;

const request = async <T>(method: ApiMethod, path: ApiPath, body?: unknown): Promise<T> => {
    const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
};

export const api = {
    get<T>(path: ApiPath) {
        return request<T>('GET', path);
    },
    post<T>(path: ApiPath, body?: unknown) {
        return request<T>('POST', path, body);
    },
    patch<T>(path: ApiPath, body?: unknown) {
        return request<T>('PATCH', path, body);
    },
    put<T>(path: ApiPath, body?: unknown) {
        return request<T>('PUT', path, body);
    },
    delete<T>(path: ApiPath, body?: unknown) {
        return request<T>('DELETE', path, body);
    }
};
