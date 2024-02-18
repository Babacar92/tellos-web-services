import { Inject, Injectable } from '@nestjs/common';
import { ContractEntity } from 'src/entities/psql/ContractEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { ContractCreateArgInput } from '../dto/args/contract.create.arg.input';
import { ContractFilterArgInput } from '../dto/args/contract.filter.arg.input';
import { ContractRemoveArgInput } from '../dto/args/contract.remove.arg.input';
import { ContractUpdateArgInput } from '../dto/args/contract.update.arg.input';
import { ContractPaginationResultInterface } from '../dto/interfaces/contract.pagination.result.interface';
import { CONTRACT_PROVIDERS_NAMES } from '../dto/provider/contract.providers';
import { HTML2PDF_UPLOAD_DIRNAME } from '../../../libs/html-to-pdf/services/html-to-pdf.service';
import * as fs from 'fs';
import axios from 'axios';
import { ContractLogger } from '../logger/contract.logger';

@Injectable()
export class ContractService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'cp.id'],
        ['text', 'cp.text'],
        ['typeContract', 'cp.typeContract'],
        ['employeeId', 'emp.id'],
        ['employee', 'emp.id'],
        ['employee.firstname', 'emp.firstname'],
        ['employee.lastname', 'emp.lastname'],
        ['status', 'cp.status'],
        ['active', 'cp.active'],
        ['isGenerate', 'cp.isGenerate'],
        ['createdAt', 'cp.createdAt'],
        ['updatedAt', 'cp.updatedAt'],
        ['deletedAt', 'cp.deletedAt'],
        ['createdBy', 'cp.createdBy'],
        ['updatedBy', 'cp.updatedBy'],
    ]);

    private baseUrl = 'https://api-sandbox.yousign.app/v3';

    private apiKey = '';

    private path = `${HTML2PDF_UPLOAD_DIRNAME}/contract-preview/`;

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        @Inject(CONTRACT_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<ContractEntity>,
        private readonly _logger: ContractLogger,
    ) {
        super();
    }

    /**
     * Check if Quick Access Exist
     * @param id 
     * @param withDeleted 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async exist(
        id?: number | ContractEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof ContractEntity) id = id.id;

        return this.existByColumn(id, "id", null, withDeleted, repo, manager);
    }

    /**
     * Found Quick Access by column search and is value
     * @param value 
     * @param column 
     * @param id 
     * @param withDeleted 
     * @param repo 
     * @returns 
     */
    public async existByColumn(
        value: any,
        column: string,
        id?: number | ContractEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof ContractEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('cp', manager?.queryRunner)

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (ContractEntity.isColumnString(column)) {
                qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
            } else {
                qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
            }

            if (id > 0 && column !== "id") qb.andWhere(`${this._cn('id')} != :column_id`, { column_id: id });

            const { total } = await qb.getRawOne();

            resolve(parseInt(total) > 0);
        });
    }

    /**
     * Return all quick access
     * @param repo 
     * @returns 
     */
    public async findAll(
        filter?: ContractFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractEntity[]> {
        const qb = this._initSelect(repo, manager);

        await this._applyFilter(qb, filter, sort);

        return qb.getMany();
    }

    /**
     * Return data with pagination
     * @param sort 
     * @param pagination 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findContractAndPaginationAll(
        filter: ContractFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractPaginationResultInterface> {
        const qb = this._initSelect(
            repo,
            manager,
        );

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return one quick access by his id
     * @param id 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async findOne(
        id: number | ContractEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractEntity> {
        if (id instanceof ContractEntity) id = id.id;
        return this.findByColumn("id", id, repo, manager);
    }

    /**
     * Return an existing user by his column value
     * @param column 
     * @param value 
     * @param repo 
     */
    public async findByColumn(
        column: string,
        value: any,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractEntity> {
        const qb = this._initSelect(repo, manager);

        if (ContractEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
        }

        return qb.getOne();
    }

    /**
     * Create new Employee Contract
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async create(
        data: ContractCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractEntity> {
        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const contract = new ContractEntity();

            // Get uploaded file
            const { ...rest } = data;

            // Set Data
            Object.assign(contract, rest);

            // Save it
            const result = await transaction.save(contract);

            if (result) {
                this._logger.create(contract);

                return this.findOne(result.id, repo, transaction);
            }
        }, (manager || repo));
    }

    /**
     * Update new Employee Contract
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async update(
        data: ContractUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<ContractEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldContract = await this.findOne(id, repo, transaction);

            if (oldContract) {
                // Set old data
                this._logger.setOldData(oldContract);

                // Add new Data
                Object.assign(oldContract, req);

                // Save Data
                const result = await transaction.save(oldContract);

                if (result) {
                    this._logger.update(oldContract);

                    return this.findOne(id, repo, transaction);
                }
            }
        }, (manager || repo));
    }

    /**
     * Update an existing entity
     * @param updateEntity 
     * @param repo 
     * @returns
     */
    public async remove(
        req: ContractRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof ContractEntity ? id.id : id;
                const contract = await this.findOne(id, repo, transaction);

                if (contract instanceof ContractEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(ContractEntity, contract.id);

                        this._logger.delete(contract);
                    } else {
                        await transaction.softDelete(ContractEntity, contract.id);

                        this._logger.softDelete(contract);
                    }

                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }, (manager || repo));
    }

    // ####################################### DEV CHRISTEVIE YOUSIGN #######################################
    //Signature Request
    public async signatureRequest(): Promise<any> {
        const requestBody = {
            name: 'contrat sign',
            delivery_mode: 'email',
            timezone: 'Europe/Paris',
        };

        try {
            const response = await axios.post('https://api-sandbox.yousign.app/v3/signature_requests', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.apiKey}`,
                },
            });
            const statusCode = response.status;

            return response.data;
        } catch (error) {
            throw error;
        }
    }

    //Upload Document
    public async uploadDocument(signatureRequestId: string, filename: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const axios = require('axios').default;
                const FormData = require('form-data');
                const form = new FormData();
                form.append('nature', 'signable_document');
                form.append('file', fs.readFileSync(`${this.path}${filename}`), {
                    filename: filename
                });

                axios.post(
                    `${this.baseUrl}/signature_requests/${signatureRequestId}/documents`,
                    form,
                    {
                        headers: {
                            ...form.getHeaders(),
                            Authorization: `Bearer ${this.apiKey}`,
                            'Content-Type': 'application/pdf',
                        },
                    }
                ).then(data => {
                    const statusCode = data.status;

                    if (statusCode !== 201) {
                        throw new Error('Error while uploading document');
                    }

                    resolve(data);

                    return data;
                }).catch(error => {

                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    //Add Signer
    public async addSigner(
        signatureRequestId: string,
        documentId: string,
        email: string,
        prenom: string,
        nom: string
    ): Promise<any> {
        try {
            const response = await axios.post(
                `${this.baseUrl}/signature_requests/${signatureRequestId}/signers`,
                {
                    info: {
                        first_name: prenom,
                        last_name: nom,
                        email,
                        locale: 'fr',
                    },
                    fields: [
                        {
                            type: 'signature',
                            document_id: documentId,
                            page: 1,
                            width: 180,
                            x: 400,
                            y: 650
                        },
                    ],
                    signature_level: 'electronic_signature',
                    signature_authentication_mode: 'otp_email',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                }
            )

            return response.data
        } catch (error) {
            // Handle error
            throw error;
        }
    }

    //Acitve Signature Request
    public async activateSignatureRequest(signatureRequestId: string): Promise<any> {
        try {
            await axios.post(
                `${this.baseUrl}/signature_requests/${signatureRequestId}/activate`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                }
            ).then(response => {
                return response;
            });
        } catch (error) {
            throw new Error(`Error activating Signature Request: ${error.message}`);
        }
    }
    // ####################################### DEV CHRISTEVIE YOUSIGN #######################################

    /**
     * Init Select Query Builder
     * @param repo 
     * @returns 
     */
    private _initSelect(
        repo?: string,
        manager?: EntityManager,
    ): SelectQueryBuilder<ContractEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('cp', manager?.queryRunner)
            .leftJoinAndSelect('cp.employee', 'emp')
            .leftJoinAndSelect('emp.picture', 'picture')
            .leftJoinAndSelect('emp.login', 'login')
            .leftJoinAndSelect('cp.comments', 'c');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<ContractEntity>,
        filter?: ContractFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('employee.firstname')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('employee.lastname')} ILIKE :search)`, { search: `%${filter.search}%` });

                    _qb.orWhere(`(${this._cn('status')}::text ILIKE :search)`, { search: `%${filter.search}%` });
                }));
            }

            if (filter.status) qb.andWhere(`${this._cn('job')} ILIKE :job`, { job: `%${filter.status}%` });

            if (filter.employeeId) qb.andWhere(`${this._cn('employeeId')} = :employeeId`, { employeeId: filter.employeeId });

            if (filter.employeeIds?.length) qb.andWhere(`${this._cn('employeeId')} IN (:...employeeIds)`, { employeeIds: filter.employeeIds });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<ContractEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return ContractService.ColumnQueryNames.get(columnName);
    }

}
