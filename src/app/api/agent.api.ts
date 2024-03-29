import axios, { AxiosResponse } from 'axios';

const defaultBaseUrl = 'http://localhost:5167/api';

const frontendServerBaseUrl = 'http://localhost:3000';

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const createAxiosInstance = (baseUrl: string) => {
    const instance = axios.create({
        baseURL: baseUrl,
    })
    // mb add error messages

    return {
        get: async <T> (url: string, params?: URLSearchParams) => instance.get<T>(url, { params })
            .then(responseBody),

        post: async <T> (url: string, body: object, headers?: object) => instance.post<T>(url, body, headers)
            .then(responseBody),

        put: async <T> (url: string, body: object) => instance.put<T>(url, body)
            .then(responseBody),

        delete: async <T>(url: string) => instance.delete<T>(url)
            .then(responseBody),
    };
}
const Agent = createAxiosInstance(defaultBaseUrl);
const AgentFrontend = createAxiosInstance(frontendServerBaseUrl);

export { AgentFrontend };
export default Agent;