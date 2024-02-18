import { Injectable } from '@nestjs/common';
import { RequestContext } from 'nestjs-request-context';

/**
 * Handler of Request
 */
@Injectable()
export class HandlerRequestService {

    /**
     * Return absolute url
     * @param path 
     * @returns 
     */
    public getAbsoluteUrl(path: string): string {
        if (path) {
            const url = this.getUrl();
            if (!path.match(/^\//)) path = `/${path}`;
            return `${url}${path}`;
        }
        return;
    }

    /**
     * Return the current Url
     * @returns 
     */
    public getUrl(): string {
        const headers = this.getRequest()?.headers;
        if (headers) {
            // Get API Prefix
            const { API_HASH } = process.env;
            const apiPrefix = `api-${API_HASH}`;

            const protocole = headers['x-forwarded-proto'];
            const host = headers.host;
            return `${protocole}://${host}/${apiPrefix}`;
        }
        return;
    }

    /**
     * Return cookie value
     * @param key 
     * @param def 
     * @returns 
     */
    public getHeader(key: string, def: any = null) {
        const value = this.getRequest()?.headers[key];
        return value !== undefined ? value : def;
    }

    /**
     * Return cookie value
     * @param key 
     * @param def 
     * @returns 
     */
    public getCookie(key: string, def: any = null) {
        const value = this.getRequest()?.cookies[key];
        return value !== undefined ? value : def;
    }

    /**
     * Return data from request
     * @param key 
     * @param def 
     * @returns 
     */
    public getData(key: string, def: any = null) {
        const req = this.getRequest();
        let value = req.body[key];
        if (value === undefined) value = req.params[key];
        return value !== undefined ? value : def;
    }

    /**
     * Return request
     * @returns 
     */
    public getRequest() {
        return RequestContext.currentContext.req;
    }
}
