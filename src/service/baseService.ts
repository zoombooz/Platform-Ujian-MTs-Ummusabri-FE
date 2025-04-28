import Swal from "sweetalert2";
import { Environment } from "../environment/environment";
import axios, { AxiosInstance } from "axios";

export class BaseService {
    protected api: AxiosInstance;
    protected baseUrl = Environment.base_url;
    protected header = {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    }

    constructor(url?: string) {
        this.api = axios.create({
            baseURL: url ?? undefined,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('authToken');
                if(token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        )
    }

    protected buildQueryParams(queryParams: Record<string, any>): string {
        if(!queryParams) return '';
        let textString = '?';
        let firstIndex = true;
        for(const key in queryParams){
            if(firstIndex) {
                textString += `${key}=${queryParams[key]}`;
                firstIndex = false;
            }else if(queryParams[key]){
                textString += `&${key}=${queryParams[key]}`
            }
        };
        return textString; 
    }

    protected handleOperationError(serviceName: string, operation: string, endpoint: string, error: Error, title: string = 'Request Failed') {
        console.error({
            serviceName,
            operation,
            endpoint,
            error
        });
        Swal.fire({
            icon: "error",
            title,
            text: `${(error as Error).message}`,
        })
    }
}