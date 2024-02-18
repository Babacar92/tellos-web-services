import { Injectable, NotAcceptableException } from '@nestjs/common';
import * as fs from 'fs';
import { HandlerRequestService } from '../../handler/service/request/handler.request.service';
import { ascendingResult, descendingResult, dump } from '../../../utils/utils';
import { TranslationFrontInterface, TranslationsFrontInterface, TranslationTextFrontInterface } from '../dto/interfaces/controller.interfaces';
import { TranslationInterface } from '../dto/interfaces/defaut.interface';
import { TranslationTextType } from '../dto/types/translation.text.type';
import { TranslationType } from '../dto/types/translation.type';
import { parse } from 'csv-parse';
import { PaginationArg } from '../../databases/dto/args/pagination.arg';
import { TranslationPaginationResultInterface } from '../dto/interfaces/translation.pagination.result.interface';
import { buildPaginationResult, getPaginationSkip } from '../../databases/utils/db.utils';
import { TranslationFilterArg } from '../dto/args/translation.filter.arg';
import * as dotenv from 'dotenv';
import { UPLOAD_MODE } from 'src/libs/upload/service/upload.service';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';

dotenv.config();

const {
    PWD,
    SOURCE_CODE,
} = process.env;

/**
 * Default Langs codes
 */
export enum DEFAULT_LANGS_CODES {
    FR = 'FR',
    EN = 'EN',
    NL = 'NL',
}

/**
 * Default Langs titles
 */
export enum DEFAULT_LANGS_TITLES {
    FR = 'Français',
    EN = 'English',
    NL = 'Nederlands',
}

/**
 * Translation dirname
 */
export const TRANSLATIONS_DIRNAME = `${PWD}${SOURCE_CODE}/translations`;

/**
 * Default Local
 */
export const DEFAULT_LOCAL = DEFAULT_LANGS_CODES.FR;

/**
 * Default Domain
 */
export const DEFAULT_DOMAIN = "messages";

/**
 * GitIgnore File Name
 */
export const GITIGNORE_FILENAME = ".gitignore";

/**
 * Lang Service
 */
@Injectable()
export class TranslationService {

    private _domains: string[] = [];

    private _codes: { [name: string]: string } = {};

    private _langs: TranslationType[] = [];

    private _texts: { [name: string]: TranslationTextType[] } = {};

    public constructor(
        private readonly _handlerRequestService: HandlerRequestService,
    ) {
        this._initTranslation();
    }

    /**
     * Return default DOMAIN
     * @returns 
     */
    public getDefaultDomain(): string {
        return DEFAULT_DOMAIN;
    }

    /**
     * Return default LANG
     * @returns 
     */
    public getDefaultLang(): string {
        return DEFAULT_LOCAL;
    }

    /**
     * Replace property of an object with his key value
     * @param object 
     * @param properties 
     * @param domain 
     * @param local 
     * @param toString 
     * @param createIfNotExist 
     * @returns 
     */
    public transObject(
        object: any,
        properties: string[],
        domain?: string,
        local?: string,
        toString: boolean = true,
        createIfNotExist: boolean = true,
    ): void {
        for (let _k in properties) {
            const property = properties[_k];
            if (object[property]) {
                object[property] = this.trans(object[property], null, domain, local, createIfNotExist);
                if (toString) object[property] = object[property].getValue();
            }
        }
    }


    /**
     * Trans Text Key, create key if not exist
     * @param key 
     * @param params 
     * @param domain 
     * @param local 
     * @param createIfNotExist 
     * @returns 
     */
    public trans(
        key?: string,
        params?: { [name: string]: string; },
        domain?: string,
        local?: string,
        createIfNotExist: boolean = true
    ): TranslationTextType {
        if (!key) return;

        // Set Default Domain if not set and check Domain
        if (!domain) domain = DEFAULT_DOMAIN;
        this._checkDomain(domain);

        // Set Default Local if not set
        if (!local) local = this._handlerRequestService.getHeader('local', DEFAULT_LOCAL).toUpperCase();
        if (!DEFAULT_LANGS_CODES[local]) local = DEFAULT_LOCAL;

        // Get all text by local
        const _texts = this._texts[local];

        if (_texts) {
            const _text = _texts.find(_text_ => _text_.key === key && _text_.lang.domain === domain);
            if (_text) {
                const clone = _text.clone();
                if (params) clone.addParameters(params);
                return clone;
            }
        }

        if (createIfNotExist) this.addText(key, key, domain);

        return TranslationTextType.build({
            key: key,
            value: key,
            parameters: params,
        });
    }

    /**
     * Check if text exist
     * @param key
     * @param domain
     * @returns
     */
    public async exist(key: string, domain?: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            // Set Default Domain if not set and check Domain
            if (!domain) domain = DEFAULT_DOMAIN;
            this._checkDomain(domain);

            const found = this._langs.filter(_lang => _lang.texts.find(_text => _text.key === key && _lang.domain === domain));

            resolve(found.length > 0);
        });
    }


    /**
     * Check if the request value is valid for request
     * @param value 
     * @returns 
     */
    public async validate(value: any): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (typeof value === 'string') {
                try {
                    value = JSON.parse(value);
                } catch (e) { }
            }

            resolve(value && value.key && value[DEFAULT_LOCAL]);
        });
    }

    /**
     * Return all Texts with pagination
     * @param repo 
     * @returns 
     */
    public async findPaginationAll(
        pagination: PaginationArg,
        filter?: TranslationFilterArg,
        sort?: DatabaseSortArg,
    ): Promise<TranslationPaginationResultInterface> {
        return new Promise(async (resolve, reject) => {
            const { texts } = await this.getAll(filter, sort);
            const count = texts.length;
            const skip = getPaginationSkip(pagination);
            const endSkip = skip + pagination.limit;
            const result = texts.filter((_text, _i) => _i >= skip && _i <= endSkip);

            resolve(buildPaginationResult(result, count, pagination));
        });
    }

    /**
     * Return all texts of translation
     * @returns 
     */
    public async getAll(
        filter?: TranslationFilterArg,
        sort?: DatabaseSortArg,
    ): Promise<TranslationsFrontInterface> {
        return new Promise(async (resolve, reject) => {
            const languages: TranslationFrontInterface[] = [];
            let texts: TranslationTextFrontInterface[] = [];
            let current = this._handlerRequestService.getHeader('local', DEFAULT_LOCAL).toUpperCase();
            if (!DEFAULT_LANGS_CODES[current]) current = DEFAULT_LOCAL;

            // Add default lang to first Array
            const defaultTitle = this._codes[DEFAULT_LOCAL];
            languages.push({
                code: DEFAULT_LOCAL,
                title: defaultTitle,
            });

            // Add languages
            for (let _kLang in this._langs) {
                const lang = this._langs[_kLang];
                if (!languages.find(_l => _l.code === lang.code)) {
                    languages.push({
                        code: lang.code,
                        title: lang.title,
                    });
                }
            }

            // Add texts
            for (let _code in this._texts) {
                const _texts = this._texts[_code];
                for (let _kText in _texts) {
                    const text = _texts[_kText];
                    const foundText = texts.find(_t => _t.key === text.key && _t.domain === text.lang.domain);
                    if (foundText) {
                        foundText[_code] = text.value;
                    } else {
                        const _newText = {
                            domain: text.lang.domain,
                            key: text.key,
                        };
                        _newText[_code] = text.value;
                        texts.push(_newText);
                    }
                }
            }

            if (filter) {
                if (filter.search) {
                    const search = filter.search.toLowerCase();
                    texts = texts.filter(_v => {
                        return _v.key.toLowerCase().includes(search)
                            || _v.domain.toLowerCase().includes(search)
                            || !!languages.find(_l => _v[_l.code].toLowerCase().includes(search));
                    });
                }
            }

            // Sort result
            texts = texts.sort((a, b) => {
                // if (sort && sort.column && sort.order) {
                //     return sort.order === 'ASC'
                //         ? ascendingResult(a[sort.column], b[sort.column])
                //         : descendingResult(a[sort.column], b[sort.column]);
                // }
                return ascendingResult(a.domain, b.domain);
            });

            resolve({
                current: current,
                languages: languages,
                texts: texts,
            });
        });
    }

    /**
     * Return texts to JSON format
     * @returns 
     */
    public toJson(): string {
        return JSON.stringify(this._getTextsForExport());
    }

    /**
     * Return texts to CSV format
     * @returns 
     */
    public toCsv(): string {
        const texts = this._getTextsForExport();

        if (texts?.length) {
            // Set header
            let response = '"Domain";"Key"';
            for (let _k in this._codes) {
                response += `;"${_k.replace('"', '\\"')}"`;
            }
            response += '\n';

            // Add texts lines
            texts.forEach(_text => {
                response += `"${_text.domain}";"${_text.key}"`;

                for (let _k in this._codes) {
                    const textLangValue = _text[_k];
                    response += `;"${textLangValue.replace('"', '\\"')}"`;
                }
                response += '\n';
            });

            return response;
        }

        return;
    }

    /**
     * Import data from upload file
     * @param file 
     * @returns 
     */
    public async importFromUpload(file: Express.Multer.File): Promise<{ success: boolean }> {
        return new Promise(async (resolve, reject) => {

            if (file?.mimetype.match(/json/i)) {
                const data = JSON.parse(file.buffer.toString());

                await this.saveImportedData(data);

                resolve({ success: true });
            } else if (file?.mimetype.match(/csv/i)) {
                parse(file.buffer, { delimiter: ';' }, async (err, rows) => {
                    if (err) {
                        dump(`Error on import CSV text : ${err.message}`);
                        resolve({ success: false });
                    } else {
                        const header = rows[0];
                        rows = rows.filter((row: any, k: any) => k !== 0);

                        const data = [];

                        for (let _k in rows) {
                            const rowArray = rows[_k];
                            const rowObject: any = {};

                            for (let _k_ in rowArray) {
                                const rowValue = rowArray[_k_];
                                const headerKey = header[_k_];

                                if (headerKey.match(/domain/i)) {
                                    rowObject.domain = rowValue;
                                } else if (headerKey.match(/key/i)) {
                                    rowObject.key = rowValue;
                                } else {
                                    rowObject[headerKey] = rowValue;
                                }
                            }

                            data.push(rowObject);
                        }

                        await this.saveImportedData(data);

                        resolve({ success: true });
                    }
                });
            } else {
                resolve({ success: false });
            }
        });
    }

    /**
     * Save imported Data
     * @param data 
     * @returns 
     */
    public async saveImportedData(data: { [name: string]: string }[]): Promise<any> {
        return new Promise(async (resolve, reject) => {
            for (let _k in data) {
                const text = data[_k];
                const domain = text.domain;
                const key = text.key;
                delete text.domain;
                delete text.key;

                for (let _k_ in text) {
                    const value = text[_k_];

                    await this.editText(key, value, _k_, domain);
                }
            }

            resolve(true);
        });
    }

    /**
     * Add new Text
     * @param code 
     * @param title 
     */
    public async addLang(code?: string, title?: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (code && title && !this._codes[code]) {
                this._domains.forEach(async _domain => {
                    await this._registerNewLang(code, title, _domain);
                });

                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    /**
     * Remove an existing Lang
     * @param code 
     */
    public async removeLang(code?: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            code = code.toUpperCase();

            if (code && this._codes[code]) {
                // Remove Code
                delete this._codes[code];

                // Remove text of targeted lang
                delete this._texts[code];

                // Remove Lang
                this._langs = this._langs.filter(_lang => _lang.code !== code);

                // Remove data file
                const codeFile = code.toLowerCase();
                this._domains.forEach(async _domain => fs.unlinkSync(`${TRANSLATIONS_DIRNAME}/${_domain}.${codeFile}.json`));

                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    /**
     * Add text from request
     * @param request 
     * @returns
     */
    public async manageTextFromRequest(request: TranslationTextFrontInterface): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const key = request.key;
            const domain = request.domain;
            delete request.key;
            delete request.domain;

            const textExist = await this.exist(key, domain);

            if (!textExist) {
                await this.addText(key, request, domain);
            } else {
                for (let _k in request) {
                    await this.editText(key, request[_k], _k, domain);
                }
            }

            resolve(true);
        });
    }

    /**
     * Save Un Exist Key if not exist
     * @param key 
     * @param value 
     * @param domain 
     */
    public async addText(
        key?: string,
        value?: string | { [name: string]: string },
        domain?: string
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (key && value) {
                // Set Default Domain if not set and check Domain
                if (!domain) domain = DEFAULT_DOMAIN;
                this._checkDomain(domain);

                const domainLangs = this._langs.filter(_lang => _lang.domain === domain);
                const current = new Date();

                if (domainLangs.length) {
                    domainLangs.forEach(async _lang => {
                        const res = _lang.addText({
                            lang: _lang,
                            key: key,
                            value: value[_lang.code] || value[DEFAULT_LOCAL] || value,
                            createdAt: current,
                            updatedAt: current,
                        });

                        if (res) {
                            this._texts[_lang.code].push(_lang.getLast());

                            await this._updateLangFileData(_lang);
                        }
                    });
                } else {
                    for (let _langCode in this._codes) {
                        const langTitle = this._codes[_langCode];

                        const langInstance = TranslationType.build({
                            code: _langCode,
                            title: langTitle,
                            domain: domain,
                            createdAt: current,
                            updatedAt: current,
                        });

                        langInstance.addText({
                            lang: langInstance,
                            key: key,
                            value: value[langInstance.code] || value[DEFAULT_LOCAL] || value,
                            createdAt: current,
                            updatedAt: current,
                        });

                        this._addTextInstance(langInstance);

                        await this._updateLangFileData(langInstance);
                    }
                }

                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    /**
     * Edit Text if exist
     * @param key 
     * @param value 
     * @param local 
     */
    public async editText(key: string, value: string, local: string, domain?: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) return;

            // Set Default Domain if not set and check Domain
            if (!domain) domain = DEFAULT_DOMAIN;
            this._checkDomain(domain);

            const _texts = this._texts[local];
            if (_texts) {
                const _text = _texts.find(_text_ => _text_.key === key && _text_.lang.domain === domain);
                if (_text) {
                    const current = new Date();

                    _text.value = value;
                    _text.updatedAt = current;
                    _text.lang.updatedAt = current;

                    await this._updateLangFileData(_text.lang);
                }

                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    /**
     * Remove Value from existing Text
     * @param key 
     * @param domain 
     */
    public async deleteText(key?: string, domain?: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (key) {
                // Set Default Domain if not set and check Domain
                if (!domain) domain = DEFAULT_DOMAIN;
                this._checkDomain(domain);

                // Remove text from languages
                const targetLangs = this._langs.filter(_lang => _lang.domain === domain);
                if (targetLangs.length) {
                    targetLangs.forEach(async _lang => {
                        _lang.texts = _lang.texts?.filter(_text => _text.key !== key) || [];

                        await this._updateLangFileData(_lang);
                    });

                    // Remove texts from texts
                    for (let _k in this._texts) {
                        const texts = this._texts[_k];
                        const toRemove = texts.filter(_text => _text.key === key && _text.lang.domain === domain);

                        this._texts[_k] = this._texts[_k].filter(_text => !toRemove.find(_t => _t === _text));
                    }
                }

                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

    /**
     * Return texts for export
     * @returns 
     */
    private _getTextsForExport(): { [name: string]: string }[] {
        const exportingTexts = [];

        for (let _key in this._texts) {
            const texts = this._texts[_key];

            texts.forEach(_text => {
                const exportingText = exportingTexts.find(_t => _t.key === _text.key && _t.domain === _text.lang.domain);

                if (exportingText) {
                    exportingText[_text.lang.code] = _text.value;
                } else {
                    const data = {
                        domain: _text.lang.domain,
                        key: _text.key,
                    };

                    data[_text.lang.code] = _text.value;

                    exportingTexts.push(data);
                }
            });
        }

        return exportingTexts;
    }

    /**
     * Check the Domain name
     * @param domain 
     */
    private _checkDomain(domain?: string) {
        if (domain && !domain.match(/^[a-z\_\-]+$/i)) {
            throw new NotAcceptableException(`The domain ${domain} is not valid`);
        }
    }

    /**
     * Get text if exist or create default
     * @returns 
     */
    private async _initTranslation(): Promise<any> {
        try {
            // Create dir if not exist
            if (!fs.existsSync(TRANSLATIONS_DIRNAME)) {
                fs.mkdirSync(TRANSLATIONS_DIRNAME, { recursive: true, mode: UPLOAD_MODE });
                // Add gitignore
                fs.writeFileSync(`${TRANSLATIONS_DIRNAME}/.gitignore`, `*\n!${GITIGNORE_FILENAME}`, {
                    mode: UPLOAD_MODE,
                    encoding: 'utf8',
                });
            }

            // Get domains files
            const files = fs.readdirSync(TRANSLATIONS_DIRNAME).filter(_f => _f !== GITIGNORE_FILENAME);

            if (files.length) {
                for (let _k in files) {
                    const filename = files[_k];
                    const filepath = `${TRANSLATIONS_DIRNAME}/${filename}`;

                    const fileData: TranslationInterface = JSON.parse(fs.readFileSync(filepath, 'utf8').toString());

                    const langInstance = TranslationType.build({
                        code: fileData.code,
                        title: fileData.title,
                        domain: fileData.domain,
                        createdAt: new Date(fileData.createdAt),
                        updatedAt: new Date(fileData.updatedAt),
                    });

                    langInstance.texts = fileData.texts?.map(_text => TranslationTextType.build({
                        lang: langInstance,
                        key: _text.key,
                        value: _text.value,
                        createdAt: new Date(_text.createdAt),
                        updatedAt: new Date(_text.updatedAt),
                    }));

                    this._addTextInstance(langInstance);
                }
            } else {
                for (let _k in DEFAULT_LANGS_CODES) {
                    const code = DEFAULT_LANGS_CODES[_k];
                    const langTitle = DEFAULT_LANGS_TITLES[_k];

                    await this._registerNewLang(code, langTitle, DEFAULT_DOMAIN);
                }
            }
        } catch (e) {
        }
    }

    /**
     * Register an unexisting lang
     * @param code
     * @param langTitle
     * @param domain
     */
    private async _registerNewLang(code: string, langTitle: string, domain: string) {

        const current = new Date();
        const codeFile = code.toLowerCase();

        // Set instance
        const langInstance = TranslationType.build({
            code: code.toUpperCase(),
            title: langTitle,
            domain: domain,
            createdAt: current,
            updatedAt: current,
        });

        langInstance.addText({
            lang: langInstance,
            key: 'Hello World',
            value: 'Hello World, {username} !',
            createdAt: current,
            updatedAt: current,
        });

        fs.writeFileSync(`${TRANSLATIONS_DIRNAME}/${domain}.${codeFile}.json`, langInstance.toJson(), {
            mode: UPLOAD_MODE,
            encoding: 'utf8',
        });

        this._addTextInstance(langInstance);
    }

    /**
     * Add Lang Text Instance data
     *  - Domains
     *  - Codes
     *  - Langs
     *  - Texts
     * @param langInstance 
     * @returns 
     */
    private async _addTextInstance(langInstance: TranslationType): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (!this._domains.includes(langInstance.domain)) this._domains.push(langInstance.domain);

            if (!this._codes[langInstance.code]) this._codes[langInstance.code] = langInstance.title;

            if (!this._langs.includes(langInstance)) this._langs.push(langInstance);

            langInstance.texts?.forEach(_text => {
                if (!this._texts[langInstance.code]) this._texts[langInstance.code] = [];
                this._texts[langInstance.code].push(_text);
            });

            resolve(true);
        });
    }

    /**
     * Return Lang Path
     * @param langInstance 
     * @returns 
     */
    private _getLangPath(langInstance?: TranslationType): string {
        if (langInstance) {
            return `${TRANSLATIONS_DIRNAME}/${langInstance.domain}.${langInstance.code.toLowerCase()}.json`;
        }
        return;
    }

    /**
     * 
     * @param langInstance 
     * @returns 
     */
    private async _updateLangFileData(langInstance?: TranslationType): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (langInstance) {
                const langPath = this._getLangPath(langInstance);
                fs.writeFileSync(langPath, langInstance.toJson(), {
                    mode: UPLOAD_MODE,
                    encoding: 'utf8',
                });
                resolve(true);
            } else {
                resolve(false);
            }
        });
    }

}
