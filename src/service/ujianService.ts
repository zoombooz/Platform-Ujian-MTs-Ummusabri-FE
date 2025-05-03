import { IPaginationNew } from "../models/table.type";
import { IUjian } from "../models/ujian.type";
import { getTokenPayload, isRoleAdmin } from "../utils/jwt";
import { BaseService } from "./baseService"

class UjianService extends BaseService <IUjian>  {

    private endpoints = {
        get: `admin/ujian`
    }

    async getUjian(URL?: string, page: number = 1, limit: number = 10): Promise<{data: IUjian[], pagination: IPaginationNew}> {
        const now = Date.now()

        const queryParams = {
            mapel_id: isRoleAdmin() ? '' : getTokenPayload().mapel_id,
            page,
            limit
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
}

export const ujianService = new UjianService();