import { Inject, Injectable } from '@nestjs/common';
import { AdministrativeMaterialEntity } from 'src/entities/psql/AdministrativeMaterialEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { Brackets, EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { AdministrativeMaterialCreateArgInput } from '../dto/args/administrative-material.create.arg.input';
import { AdministrativeMaterialFilterArgInput } from '../dto/args/administrative-material.filter.arg.input';
import { AdministrativeMaterialRemoveArgInput } from '../dto/args/administrative-material.remove.arg.input';
import { AdministrativeMaterialUpdateArgInput } from '../dto/args/administrative-material.update.arg.input';
import { AdministrativeMaterialPaginationResultInterface } from '../dto/interfaces/administrative-material.pagination.result.interface';
import { ADMINISTRATIVE_MATERIAL_PROVIDERS_NAMES } from '../dto/provider/administrative-material.providers';
import { AdministrativeMaterialLogger } from '../logger/administrative-material.logger';
import { TheoreticalHoursOfUseService } from 'src/modules/theoretical-hours-of-use/service/theoretical-hours-of-use.service';

@Injectable()
export class AdministrativeMaterialService extends AbstractRepositoryService {

    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'admMat.id'],
        ['monthlyRent', 'admMat.monthlyRent'],
        ['maintenanceRent', 'admMat.maintenanceRent'],
        ['maxAuthorizedKm', 'admMat.maxAuthorizedKm'],
        ['BuybackValue', 'admMat.BuybackValue'],
        ['fixedAssetCode', 'admMat.fixedAssetCode'],
        ['salePrice', 'admMat.salePrice'],
        ['geolocatizationBoxNumber', 'admMat.geolocatizationBoxNumber'],
        ['monthlyUnitPrice', 'admMat.monthlyUnitPrice'],
        ['TSVRPurchase', 'admMat.TSVRPurchase'],
        ['TSVRTransfer', 'admMat.TSVRTransfer'],
        ['totalCard', 'admMat.totalCard'],
        ['PASSango', 'admMat.PASSango'],
        ['breakevenPoint', 'admMat.breakevenPoint'],
        ['utilizationRate', 'admMat.utilizationRate'],
        ['comment', 'admMat.comment'],
        ['financing', 'admMat.financing'],
        ['exitType', 'admMat.exitType'],
        ['typeOfSale', 'admMat.typeOfSale'],
        ['pendingExit', 'admMat.pendingExit'],
        ['carFleetInsurance', 'admMat.carFleetInsurance'],
        ['machineryInsurance', 'admMat.machineryInsurance'],
        ['contractStartDate', 'admMat.contractStartDate'],
        ['contractEndDate', 'admMat.contractEndDate'],
        ['saleDate', 'admMat.saleDate'],
        ['active', 'admMat.active'],
        ['createdAt', 'admMat.createdAt'],
        ['updatedAt', 'admMat.updatedAt'],
        ['deletedAt', 'admMat.deletedAt'],
        ['createdBy', 'admMat.createdBy'],
        ['updatedBy', 'admMat.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository 
     */
    public constructor(
        private readonly _theoreticalHoursOfUse: TheoreticalHoursOfUseService,
        @Inject(ADMINISTRATIVE_MATERIAL_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<AdministrativeMaterialEntity>,
        private readonly _logger: AdministrativeMaterialLogger
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
        id?: number | AdministrativeMaterialEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof AdministrativeMaterialEntity) id = id.id;

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
        id?: number | AdministrativeMaterialEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof AdministrativeMaterialEntity) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('admMat', manager?.queryRunner);

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (AdministrativeMaterialEntity.isColumnString(column)) {
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
        filter?: AdministrativeMaterialFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<AdministrativeMaterialEntity[]> {
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
    public async findAdministrativeMaterialsAndPaginationAll(
        filter: AdministrativeMaterialFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<AdministrativeMaterialPaginationResultInterface> {
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
        id: number | AdministrativeMaterialEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<AdministrativeMaterialEntity> {
        if (id instanceof AdministrativeMaterialEntity) id = id.id;
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
    ): Promise<AdministrativeMaterialEntity> {
        const qb = this._initSelect(repo, manager);

        if (AdministrativeMaterialEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, { column_value: value });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, { column_value: value });
        }

        return qb.getOne();
    }

    /**
     * Create new Quick Access
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async create(
        data: AdministrativeMaterialCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<AdministrativeMaterialEntity> {

        return this.useTransaction(async transaction => {
            // Init new Entity Quick Access
            const AdministrativeMaterial = new AdministrativeMaterialEntity();

            /** 
            *Find the theoretical hours of use by his id
            */
            const theoreticalHours = await this._theoreticalHoursOfUse.findOne(data.theoreticalHour.id)

            /**
            *Calculate the usage rate that will be store
            */
            data.utilizationRate = data.utilizationRate / theoreticalHours.hoursNumber

            // Set Data
            Object.assign(AdministrativeMaterial, data);

            // Save hit
            const result = await transaction.save(AdministrativeMaterial);

            if (result) {
                this._logger.create(AdministrativeMaterial);

                return this.findOne(result.id, repo, transaction);
            }
        }, (manager || repo));
    }

    /**
     * Update new Quick Access
     * @param data 
     * @param repo 
     * @param manager 
     * @returns 
     */
    public async update(
        data: AdministrativeMaterialUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<AdministrativeMaterialEntity> {
        return this.useTransaction(async transaction => {
            // Extract ID
            const { id, ...req } = data;

            // Find existing
            const oldAdministrativeMaterial = await this.findOne(id, repo, transaction);

            if (oldAdministrativeMaterial) {
                // Set old data
                this._logger.setOldData(oldAdministrativeMaterial);

                // Add new Data
                Object.assign(oldAdministrativeMaterial, req);

                // Save Data
                const result = await transaction.save(oldAdministrativeMaterial);

                if (result) {
                    this._logger.update(oldAdministrativeMaterial);

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
        req: AdministrativeMaterialRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async transaction => {
            if (req && req.id && req.type) {
                let {
                    id,
                    type,
                } = req;

                id = id instanceof AdministrativeMaterialEntity ? id.id : id;
                const AdministrativeMaterial = await this.findOne(id, repo, transaction);

                if (AdministrativeMaterial instanceof AdministrativeMaterialEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        await transaction.delete(AdministrativeMaterialEntity, AdministrativeMaterial.id);

                        this._logger.delete(AdministrativeMaterial);
                    } else {
                        await transaction.softDelete(AdministrativeMaterialEntity, AdministrativeMaterial.id);

                        this._logger.softDelete(AdministrativeMaterial);
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

    /**
     * Init Select Query Builder
     * @param repo 
     * @returns 
     */
    private _initSelect(
        repo?: string,
        manager?: EntityManager,
    ): SelectQueryBuilder<AdministrativeMaterialEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('admMat', manager?.queryRunner)
            .leftJoinAndSelect('admMat.companyOwner', 'co')
            .leftJoinAndSelect('admMat.theoreticalHour', 'th');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb 
     * @param sort 
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<AdministrativeMaterialEntity>,
        filter?: AdministrativeMaterialFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {

        if (filter) {
            if (filter.id) qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length) qb.andWhere(`${this._cn('id')} IN (:...id)`, { id: filter.ids });

            if (filter.search) {
                qb.andWhere(new Brackets(_qb => {
                    _qb.orWhere(`(${this._cn('comment')} ILIKE :search)`, { search: `%${filter.search}%` });

                    if (filter.search.match(/^[0-9]+((\.|,)[0-9]+)?$/)) {
                        _qb.orWhere(`(${this._cn('monthlyRent')} = :search)`, { search: filter.search });
                        _qb.orWhere(`(${this._cn('maintenanceRent')} = :search)`, { search: filter.search });
                        _qb.orWhere(`(${this._cn('maxAuthorizedKm')} = :search)`, { search: filter.search });
                        _qb.orWhere(`(${this._cn('BuybackValue')} = :search)`, { search: filter.search });
                        _qb.orWhere(`(${this._cn('fixedAssetCode')} = :search)`, { search: filter.search });
                        _qb.orWhere(`(${this._cn('salePrice')} = :search)`, { search: filter.search });
                        _qb.orWhere(`(${this._cn('geolocatizationBoxNumber')} = :search)`, { search: filter.search });
                        _qb.orWhere(`(${this._cn('monthlyUnitPrice')} = :search)`, { search: filter.search });
                        _qb.orWhere(`(${this._cn('TSVRPurchase')} = :search)`, { search: filter.search });
                        _qb.orWhere(`(${this._cn('TSVRTransfer')} = :search)`, { search: filter.search });
                        _qb.orWhere(`(${this._cn('totalCard')} = :search)`, { search: filter.search });
                        _qb.orWhere(`(${this._cn('PASSango')} = :search)`, { search: filter.search });
                        _qb.orWhere(`(${this._cn('breakevenPoint')} = :search)`, { search: filter.search });
                        _qb.orWhere(`(${this._cn('utilizationRate')} = :search)`, { search: filter.search });
                    }
                }));
            }


            if (filter.comment) qb.andWhere(`${this._cn('comment')} ILIKE :comment`, { comment: `%${filter.comment}%` });

            if (filter.comments?.length) qb.andWhere(`${this._cn('comment')} IN (:...comments)`, { comments: filter.comments });

            if (filter.contractStartDate) qb.andWhere(`${this._cn('contractStartDate')} = :contractStartDate`, { contractStartDate: filter.contractStartDate });

            if (filter.contractEndDate) qb.andWhere(`${this._cn('contractEndDate')} = :contractEndDate`, { contractEndDate: filter.contractEndDate });

            if (filter.saleDate) qb.andWhere(`${this._cn('saleDate')} = :saleDate`, { saleDate: filter.saleDate });
        }

        qb.sortResult(sort, columnName => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<AdministrativeMaterialEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName 
     * @returns 
     */
    private _cn(columnName?: string): string | undefined {
        return AdministrativeMaterialService.ColumnQueryNames.get(columnName);
    }

}
