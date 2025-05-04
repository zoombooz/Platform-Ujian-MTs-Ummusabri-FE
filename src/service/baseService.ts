import Swal from "sweetalert2";
import { Environment } from "../environment/environment";
import axios, { AxiosInstance } from "axios";
import { defaultPaginationValueNew, IPaginationNew } from "../models/table.type";

export interface EntityCache <T> {
    [key: string]: {
        data: T[],
        timestamp: number,
        pagination: IPaginationNew
    }
}

export class BaseService <T> {
    protected api: AxiosInstance;
    protected baseUrl = Environment.base_url;
    protected header = {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    }

    protected allData: EntityCache<T> = {};
    protected currentData: T[] = [];
    protected cacheDuration: number = 5 * 60 * 1000;
    protected pagination: IPaginationNew = defaultPaginationValueNew;

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
            if(firstIndex && queryParams[key]) {
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

    protected isCacheValid(cacheKey: string): boolean {
        if(!this.allData[cacheKey]) return false;

        const currentTime = Date.now();
        const cacheAge = currentTime - this.allData[cacheKey].timestamp;
        return cacheAge < this.cacheDuration;
    }

    protected clearCache() {
        const cache = this.allData;
        for(const key in cache){
            delete cache[key]
        }
        this.allData = cache;
    }
}