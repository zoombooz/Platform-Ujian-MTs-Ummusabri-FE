import { IPeserta } from "../models/peserta.type";
import { BaseService } from "./baseService";

class PesertaService extends BaseService {

    private endpoints = {
        get: `admin/peserta`,
        add: `admin/peserta`,
        edit: (peserta_id: string) => `admin/peserta/${peserta_id}`,
        delete: (peserta_id: string) => `admin/peserta/${peserta_id}`,
    };
    
    getPeserta(URL?: string, jurusan_id: string = '') {
        const queryParams = {
            jurusan_id
        }
        const url = URL ?? `${this.baseUrl}${this.endpoints['get']}${this.buildQueryParams(queryParams)}`;
        return this.api.get(url).catch(error => {
            this.handleOperationError('pesertaService', 'getPeserta', url, error);
        });   
    }
    
    addPeserta(body: Partial<IPeserta>) {
        const url = `${this.baseUrl}${this.endpoints['add']}`;
        return this.api.post(url, body);
    }

    editPeserta(peserta_id: string, body: Partial<IPeserta>) {
        const url = `${this.baseUrl}${this.endpoints['edit'](peserta_id)}`;
        return this.api.put(url, body);
    }

    deletePeserta(peserta_id: string) {
        const url = `${this.baseUrl}${this.endpoints['delete'](peserta_id)}`;
        return this.api.delete(url);
    }
}

export const pesertaService = new PesertaService();
