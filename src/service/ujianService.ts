import { IPaginationNew } from "../models/table.type";
import { IUjian } from "../models/ujian.type";
import { getTokenPayload, isRoleAdmin } from "../utils/jwt";
import { BaseService } from "./baseService"

class UjianService extends BaseService <IUjian>  {

    private endpoints = {
        get: `admin/ujian`,
        add: `admin/ujian`,
        edit: (ujian_id: number) => `admin/ujian/${ujian_id}`,
        delete: (ujian_id: number) => `admin/ujian/${ujian_id}`,
    }

    async getUjian(URL?: string, page: number = 1, limit: number = 10, kelompok_ujian_id?: string): Promise<{data: IUjian[], pagination: IPaginationNew}> {
        const now = Date.now()

        const queryParams = {
            mapel_id: isRoleAdmin() ? '' : getTokenPayload().mapel_id,
            page,
            limit,
            kelompok_ujian_id
        }

        const url = URL ?? `${this.baseUrl}${this.endpoints['get']}${this.buildQueryParams(queryParams)}`;

        if(this.isCacheValid(url)){
            const {data, pagination} = this.allData[url];
            return {data, pagination}
        }

        try {
            const response = await this.api.get(url);
            const {data, pagination} = (({data, ...pagination}) => {
                return {data, pagination}
            })(response.data)

            this.allData[url] = {data, pagination, timestamp: now};
            this.currentData = data;
            return {data, pagination}
        } catch (error) {
            this.handleOperationError('ujianService', 'getUjian', url, error as Error);
            throw error;
        }
    }

    addUjian(body: Partial<IUjian>) {
        this.clearCache();
        const url = `${this.baseUrl}${this.endpoints['add']}`;
        return this.api.post(url, body);
    }

    editUjian(ujian_id: number, body: Partial<IUjian>) {
        this.clearCache();
        const url = `${this.baseUrl}${this.endpoints['edit'](ujian_id)}`;
        return this.api.put(url, body);
    }

    deleteUjian(ujian_id: number) {
        this.clearCache();
        const url = `${this.baseUrl}${this.endpoints['delete'](ujian_id)}`;
        return this.api.delete(url);
    }
}

export const ujianService = new UjianService();