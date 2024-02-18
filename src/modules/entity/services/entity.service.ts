import { Inject, Injectable } from '@nestjs/common';
import { EntityEntity } from 'src/entities/psql/EntityEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { UploadService } from 'src/libs/upload/service/upload.service';
import {
    Brackets,
    EntityManager,
    In,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { PaginationArg } from '../../../libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from '../../../libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from '../../../libs/services/abstract.repository.service';
import { EntityCreateArgInput } from '../dto/args/entity.create.arg.input';
import { EntityFilterArgInput } from '../dto/args/entity.filter.arg.input';
import { EntityRemoveArgInput } from '../dto/args/entity.remove.arg.input';
import { EntityUpdateArgInput } from '../dto/args/entity.update.arg.input';
import { EntityPaginationResultInterface } from '../dto/interfaces/entity.pagination.result.interface';
import { EntitiesForSelectInterface } from '../dto/interfaces/entity.for.select.intergace';
import { ENTITY_PROVIDERS_NAMES } from '../dto/provider/entity.providers';
import { EntityLogger } from '../logger/entity.logger';

@Injectable()
export class EntityService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'e.id'],
        ['label', 'e.label'],
        ['identifierNumber', 'e.identifierNumber'],
        ['colorGradiantLeft', 'e.colorGradiantLeft'],
        ['colorGradiantRight', 'e.colorGradiantRight'],
        ['colorHeader', 'e.colorHeader'],
        ['colorSticker', 'e.colorSticker'],
        ['type', 'e.type'],
        ['membershipNumber', 'e.membershipNumber'],
        ['active', 'e.active'],
        ['organigramme', 'e.organigramme'],
        ['totalEmployees', 'e.totalEmployees'],
        ['creationDate', 'e.creationDate'],
        ['linkedin', 'e.linkedin'],
        ['description', 'e.description'],
        ['createdAt', 'e.createdAt'],
        ['updatedAt', 'e.updatedAt'],
        ['deletedAt', 'e.deletedAt'],
        ['createdBy', 'e.createdBy'],
        ['updatedBy', 'e.updatedBy'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     */
    public constructor(
        @Inject(ENTITY_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<EntityEntity>,
        private readonly _logger: EntityLogger,
        private readonly _uploadService: UploadService,
    ) {
        super();
    }

    async getAllEntitiesByIds(ids: number[]): Promise<EntityEntity[]> {
        const data = await this._defaultUserRepository.find({
            where: { id: In(ids) },
        });

        return ids.map((id) => data.filter((elt) => elt.id === id)[0]);
    }

    async getEntitiesByBatch(ids: number[]): Promise<EntityEntity[]> {
        const entities = await this.getAllEntitiesByIds(ids);

        return ids.map((id) => entities.find((entity) => entity.id === id));
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
        id?: number | EntityEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof EntityEntity) id = id.id;

        return this.existByColumn(id, 'id', null, withDeleted, repo, manager);
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
        id?: number | EntityEntity,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof EntityEntity) id = id.id;

            const qb = this.getRepo(repo).createQueryBuilder(
                'e',
                manager?.queryRunner,
            );

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (EntityEntity.isColumnString(column)) {
                qb.andWhere(`${this._cn(column)} ILIKE :column_value`, {
                    column_value: value,
                });
            } else {
                qb.andWhere(`${this._cn(column)} = :column_value`, {
                    column_value: value,
                });
            }

            if (id > 0 && column !== 'id')
                qb.andWhere(`${this._cn('id')} != :column_id`, {
                    column_id: id,
                });

            const x = await qb.getRawOne();

            resolve(parseInt(x.total) > 0);
        });
    }

    /**
     * Return all quick access
     * @param repo
     * @returns
     */
    public async findAll(
        filter: EntityFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EntityEntity[]> {
        const qb = this._initSelect(repo, manager);

        await this._applyFilter(qb, filter, sort);

        return qb.getMany();
    }

    /**
     * Return data with pagination
     * @param filter
     * @param sort
     * @param pagination
     * @param repo
     * @param manager
     * @returns
     */
    public async findAllAndPaginate(
        filter: EntityFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EntityPaginationResultInterface> {
        const qb = this._initSelect(repo, manager);

        await this._applyFilter(qb, filter, sort);

        return qb.getManyAndPaginate(pagination);
    }

    /**
     * Return all entities without organigramme
     * @returns
     */
    public async findEntitiesWithoutOrganigrammes(
        repo?: string,
        manager?: EntityManager,
    ): Promise<EntitiesForSelectInterface[]> {
        return (
            this.getRepo(repo)
                .createQueryBuilder('e', manager?.queryRunner)
                .select('e.id', 'id')
                .addSelect('e.label', 'label')
                // .andWhere('e.active = true')
                .andWhere('e.organigramme IS NULL')
                .orderBy('e.label', 'ASC')
                .getRawMany()
        );
    }

    /**
     * Return all entities without organigramme
     * @returns
     */
    public async findEntitiesWithoutInformations(
        repo?: string,
        manager?: EntityManager,
    ): Promise<EntitiesForSelectInterface[]> {
        return this.getRepo(repo)
            .createQueryBuilder('e', manager?.queryRunner)
            .select('e.id', 'id')
            .addSelect('e.label', 'label')
            .andWhere('e.active = true')
            .andWhere('e.description IS NULL')
            .orderBy('e.label', 'ASC')
            .getRawMany();
    }

    /**
     * Return one quick access by his id
     * @param id
     * @param repo
     * @param manager
     * @returns
     */
    public async findOne(
        id: number | EntityEntity,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EntityEntity> {
        if (id instanceof EntityEntity) id = id.id;
        return this.findByColumn('id', id, repo, manager);
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
    ): Promise<EntityEntity> {
        const qb = this._initSelect(repo, manager);

        if (EntityEntity.isColumnString(column)) {
            qb.andWhere(`${this._cn(column)} ILIKE :column_value`, {
                column_value: value,
            });
        } else {
            qb.andWhere(`${this._cn(column)} = :column_value`, {
                column_value: value,
            });
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
        data: EntityCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EntityEntity> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Quick Access
            const entity = new EntityEntity();

            // Get uploaded file
            const { logo, organigramme, ...rest } = data;

            if (logo) {
                entity.logo = await this._uploadService.saveFromGraphqlUpload(
                    logo,
                    null,
                    null,
                    null,
                    null,
                    transaction,
                );
            }

            if (organigramme) {
                entity.organigramme =
                    await this._uploadService.saveFromGraphqlUpload(
                        organigramme,
                        null,
                        null,
                        null,
                        null,
                        transaction,
                    );
            }

            // Set Data
            Object.assign(entity, rest);

            // Save hit
            const result = await transaction.save(entity);

            if (result) {
                this._logger.create(entity);

                return this.findOne(result.id, repo, transaction);
            }
        }, manager || repo);
    }

    /**
     * Update new Quick Access
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async update(
        data: EntityUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EntityEntity> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, logo, organigramme, ...req } = data;

            // Find existing
            const oldEntity = await this.findOne(id, repo, transaction);

            if (oldEntity) {
                // Set old data
                this._logger.setOldData(oldEntity);

                if (logo) {
                    oldEntity.logo =
                        await this._uploadService.saveFromGraphqlUpload(
                            logo,
                            null,
                            null,
                            oldEntity.logo,
                            null,
                            transaction,
                        );
                }

                if (organigramme) {
                    oldEntity.organigramme =
                        await this._uploadService.saveFromGraphqlUpload(
                            organigramme,
                            null,
                            null,
                            oldEntity.organigramme,
                            null,
                            transaction,
                        );
                }

                // Add new Data
                Object.assign(oldEntity, req);

                // Save Data
                const result = await transaction.save(oldEntity);

                if (result) {
                    this._logger.update(oldEntity);

                    return this.findOne(id, repo, transaction);
                }
            }
        }, manager || repo);
    }

    /**
     * Update an existing entity
     * @param updateEntity
     * @param repo
     * @returns
     */
    public async remove(
        req: EntityRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof EntityEntity ? id.id : id;
                const entity = await this.findOne(id, repo, transaction);

                if (entity instanceof EntityEntity) {
                    if (type === REMOVE_TYPES.HARD) {
                        if (entity.logo) {
                            await this._uploadService.remove(
                                {
                                    id: entity.logo,
                                    type: REMOVE_TYPES.HARD,
                                },
                                null,
                                transaction,
                            );
                        }

                        if (entity.organigramme) {
                            await this._uploadService.remove(
                                {
                                    id: entity.organigramme,
                                    type: REMOVE_TYPES.HARD,
                                },
                                null,
                                transaction,
                            );
                        }

                        await transaction.delete(EntityEntity, entity.id);

                        this._logger.delete(entity);
                    } else {
                        await transaction.softDelete(EntityEntity, entity.id);

                        this._logger.softDelete(entity);
                    }

                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }, manager || repo);
    }

    /**
     * Remove an orgranigramme from Entity
     * @param id
     * @param repo
     * @param manager
     * @returns
     */
    public async removeOrganigramme(
        id?: number,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            const existing = await this.findOne(id, repo, transaction);

            if (existing && existing.organigramme) {
                const result = await this._uploadService.remove(
                    {
                        id: existing.organigramme,
                        type: REMOVE_TYPES.HARD,
                    },
                    null,
                    transaction,
                );

                return true;
            } else {
                return false;
            }
        }, manager || repo);
    }

    /**
     * Remove an orgranigramme from Entity
     * @param id
     * @param repo
     * @param manager
     * @returns
     */
    public async removeInformation(
        id?: number,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            const existing = await this.findOne(id, repo, transaction);

            if (
                existing &&
                (existing.totalEmployees ||
                    existing.description ||
                    existing.linkedin ||
                    existing.creationDate)
            ) {
                const result = await this.update(
                    {
                        id,
                        totalEmployees: null,
                        description: null,
                        linkedin: null,
                        identifierNumber: null,
                        creationDate: null,
                    },
                    null,
                    transaction,
                );

                return true;
            } else {
                return false;
            }
        }, manager || repo);
    }

    /**
     * Init Select Query Builder
     * @param repo
     * @returns
     */
    private _initSelect(
        repo?: string,
        manager?: EntityManager,
    ): SelectQueryBuilder<EntityEntity> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('e', manager?.queryRunner)
            .leftJoinAndSelect('e.logo', 'l')
            .leftJoinAndSelect('e.organigramme', 'o');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb
     * @param sort
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<EntityEntity>,
        filter?: EntityFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {
        if (filter) {
            if (filter.hasInformation)
                qb.andWhere(`${this._cn('description')} IS NOT NULL`);

            if (filter.hasOrganigramme)
                qb.andWhere(`${this._cn('organigramme')} IS NOT NULL`);

            if (filter.id)
                qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length)
                qb.andWhere(`${this._cn('id')} IN (:...id)`, {
                    id: filter.ids,
                });

            if (filter.search) {
                qb.andWhere(
                    new Brackets((_qb) => {
                        _qb.orWhere(`(${this._cn('label')} ILIKE :search)`, {
                            search: `%${filter.search}%`,
                        });

                        _qb.orWhere(
                            `(${this._cn('description')} ILIKE :search)`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );

                        _qb.orWhere(
                            `(${this._cn('colorGradiantLeft')} ILIKE :search)`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );

                        _qb.orWhere(
                            `(${this._cn('colorGradiantRight')} ILIKE :search)`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );

                        _qb.orWhere(
                            `(${this._cn('colorHeader')} ILIKE :search)`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );

                        _qb.orWhere(
                            `(${this._cn('colorSticker')} ILIKE :search)`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );
                    }),
                );
            }

            if (filter.label)
                qb.andWhere(`${this._cn('label')} ILIKE :label`, {
                    label: `%${filter.label}%`,
                });

            if (filter.labels?.length)
                qb.andWhere(`${this._cn('label')} IN (:...labels)`, {
                    labels: filter.labels,
                });

            if (filter.colorGradiantLeft)
                qb.andWhere(
                    `${this._cn('colorGradiantLeft')} ILIKE :colorGradiantLeft`,
                    { colorGradiantLeft: `%${filter.colorGradiantLeft}%` },
                );

            if (filter.colorsGradiantLeft?.length)
                qb.andWhere(
                    `${this._cn(
                        'colorGradiantLeft',
                    )} IN (:...colorsGradiantLeft)`,
                    { colorsGradiantLeft: filter.colorsGradiantLeft },
                );

            if (filter.colorGradiantRight)
                qb.andWhere(
                    `${this._cn(
                        'colorGradiantRight',
                    )} ILIKE :colorGradiantRight`,
                    { colorGradiantRight: `%${filter.colorGradiantRight}%` },
                );

            if (filter.colorsGradiantRight?.length)
                qb.andWhere(
                    `${this._cn(
                        'colorGradiantRight',
                    )} IN (:...colorsGradiantRight)`,
                    { colorsGradiantRight: filter.colorsGradiantRight },
                );

            if (filter.colorHeader)
                qb.andWhere(`${this._cn('colorHeader')} ILIKE :colorHeader`, {
                    colorHeader: `%${filter.colorHeader}%`,
                });

            if (filter.colorsHeader?.length)
                qb.andWhere(
                    `${this._cn('colorHeader')} IN (:...colorsHeader)`,
                    {
                        colorsHeader: filter.colorsHeader,
                    },
                );

            if (filter.colorSticker)
                qb.andWhere(`${this._cn('colorSticker')} ILIKE :colorSticker`, {
                    colorSticker: `%${filter.colorSticker}%`,
                });

            if (filter.colorsSticker?.length)
                qb.andWhere(
                    `${this._cn('colorSticker')} IN (:...colorsSticker)`,
                    {
                        colorsSticker: filter.colorsSticker,
                    },
                );

            if (filter.totalEmployees)
                qb.andWhere(`${this._cn('totalEmployees')} = :totalEmployees`, {
                    totalEmployees: filter.totalEmployees,
                });

            if (filter.description)
                qb.andWhere(`${this._cn('description')} ILIKE :description`, {
                    description: `%${filter.description}%`,
                });

            if (filter.active !== undefined)
                qb.andWhere(`${this._cn('active')} = :active`, {
                    active: filter.active,
                });

            if (typeof filter.withoutId === 'number')
                qb.andWhere(`${this._cn('id')} != :withoutId`, {
                    withoutId: filter.withoutId,
                });

            if (filter.withoutIds?.length)
                qb.andWhere(`${this._cn('id')} NOT IN (:...withoutIds)`, {
                    withoutIds: filter.withoutIds,
                });

            if (filter.type)
                qb.andWhere(`${this._cn('type')}::text = :type`, {
                    type: `%${filter.type}%`,
                });

            if (filter.types?.length)
                qb.andWhere(`${this._cn('type')} IN (:...types)`, {
                    types: filter.types,
                });
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<EntityEntity> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return EntityService.ColumnQueryNames.get(columnName);
    }
}
