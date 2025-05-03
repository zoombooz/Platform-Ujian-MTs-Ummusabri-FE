import Swal from "sweetalert2";
import { IPeserta } from "../models/peserta.type";
import { IPaginationNew } from "../models/table.type";
import { getTokenPayload, isRoleAdmin } from "../utils/jwt";
import { BaseService } from "./baseService";

type PaginatedResponse <T> = IPaginationNew & {data: T}

class PesertaService extends BaseService <IPeserta> {

    private endpoints = {
        get: `admin/peserta`,
        add: `admin/peserta`,
        edit: (peserta_id: string) => `admin/peserta/${peserta_id}`,
        delete: (peserta_id: string) => `admin/peserta/${peserta_id}`,
        import: `admin/import_peserta`,
    };
    
    async getPeserta(URL?: string, page: number = 1, limit: number = 10): Promise<{data: IPeserta[], pagination: IPaginationNew}> {
        const now = Date.now();

        const queryParams = {
            jurusan_id: isRoleAdmin() ? getTokenPayload().mapel_id : '',
            page,
            limit
        }
        const url = URL ?? `${this.baseUrl}${this.endpoints['get']}${this.buildQueryParams(queryParams)}`;

        if(this.isCacheValid(url)){
            const {data, pagination} = this.allData[url];
            return {data, pagination}
        }

        try {
            const response = await this.api.get<PaginatedResponse<IPeserta[]>>(url);
            const {data, pagination} = (({data, ...pagination}) => {
                return {data, pagination}
            })(response.data)
            
            this.allData[url] = {data, timestamp: now, pagination};
            this.currentData = data;
            return {data, pagination}
        } catch (error) {
            this.handleOperationError('pesertaService', 'getPeserta', url, error as Error);
            Swal.fire({
                icon: "error",
                title: "Request Failed",
                text: `${(error as Error).message}`,
            });
            throw error;
        } 
    }
    
    addPeserta(body: Partial<IPeserta>) {
        this.clearCache();
        const url = `${this.baseUrl}${this.endpoints['add']}`;
        return this.api.post(url, body);
    }

    editPeserta(peserta_id: string, body: Partial<IPeserta>) {
        this.clearCache();
        const url = `${this.baseUrl}${this.endpoints['edit'](peserta_id)}`;
        return this.api.put(url, body);
    }

    deletePeserta(peserta_id: string) {
        this.clearCache();
        const url = `${this.baseUrl}${this.endpoints['delete'](peserta_id)}`;
        return this.api.delete(url);
    }

    importPeserta(data: FormData) {
        this.clearCache();
        const url = `${this.baseUrl}${this.endpoints['import']}`;
        return this.api.post(url, data)
    }
}

export const pesertaService = new PesertaService();
