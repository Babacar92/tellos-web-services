import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { DatabaseSortArg } from 'src/libs/databases/dto/args/database.sort.arg';
import { PaginationArg } from 'src/libs/databases/dto/args/pagination.arg';
import { REMOVE_TYPES } from 'src/libs/databases/dto/types/databases.type';
import { AbstractRepositoryService } from 'src/libs/services/abstract.repository.service';
import { UploadService } from 'src/libs/upload/service/upload.service';
import { LoginService } from 'src/modules/login/service/login.service';
import { formatNumber } from 'src/utils/utils';
import {
    Brackets,
    EntityManager,
    In,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import { EmployeeCreateArgInput } from '../dto/args/employee.create.arg.input';
import { EmployeeFilterArgInput } from '../dto/args/employee.filter.arg.input';
import { EmployeeRemoveArgInput } from '../dto/args/employee.remove.arg.input';
import { EmployeeUpdateArgInput } from '../dto/args/employee.update.arg.input';
import { EmployeePaginationResultInterface } from '../dto/interfaces/employee.pagination.result.interface';
import { EMPLOYEE_PROVIDERS_NAMES } from '../dto/provider/employee.providers';
import { EmployeeLogger } from '../logger/employee.logger';

/**
 * Length of Employee number
 */
export const EMPLOYEE_NUMBER_LENGTH = 6;

@Injectable()
export class EmployeeService extends AbstractRepositoryService {
    /**
     * The column name for search
     */
    public static ColumnQueryNames = new Map([
        ['id', 'e.id'],
        ['username', 'l.username'],
        ['boss', 'b.emailPro'],
        ['superior', 's.emailPro'],
        ['entity', 'ee.id'],
        ['companyDeparture', 'cd.label'],
        ['number', 'e.number'],
        ['emailPro', 'e.emailPro'],
        ['phonePro', 'e.phonePro'],
        ['phoneFixPro', 'e.phoneFixPro'],
        ['emailPerso', 'e.emailPerso'],
        ['phonePerso', 'e.phonePerso'],
        ['phoneFixPerso', 'e.phoneFixPerso'],
        ['phoneShortcut', 'e.phoneShortcut'],
        ['internalNumber', 'e.internalNumber'],
        ['handicap', 'e.handicap'],
        ['lastname', 'e.lastname'],
        ['nationality', 'e.nationality'],
        ['countryBirth', 'e.countryBirth'],
        ['title', 'e.title'],
        ['secureNumber', 'e.secureNumber'],
        ['residencePermit', 'e.residencePermit'],
        ['numberOfChildren', 'e.numberOfChildren'],
        ['rpExpirationDate', 'e.rpExpirationDate'],
        ['rpDeliveryBy', 'e.rpDeliveryBy'],
        ['bank', 'e.bank'],
        ['familyStatus', 'e.familyStatus'],
        ['position', 'e.position'],
        ['rib', 'e.rib'],
        ['diplome', 'e.diplome'],
        ['gender', 'e.gender'],
        ['lastnameBis', 'e.lastnameBis'],
        ['firstname', 'e.firstname'],
        ['birthday', 'e.birthday'],
        ['cityBirth', 'e.cityBirth'],
        ['address', 'e.address'],
        ['postcode', 'e.postcode'],
        ['city', 'e.city'],
        ['country', 'e.country'],
        ['active', 'e.active'],
        ['activeLabel', 'e.active'],
        ['type', 'e.type'],
        ['createdAt', 'e.createdAt'],
        ['updatedAt', 'e.updatedAt'],
        ['deletedAt', 'e.deletedAt'],
        ['createdBy', 'e.createdBy'],
        ['updatedBy', 'e.updatedBy'],
        ['department', 'd.id'],
        ['qualificationsNames', 'qn.id'],
        ['qualificationName', 'qn.id'],
        ['qualificationName.name', 'qn.name'],
        ['qualificationsTypes', 'qn.id'],
        ['qualificationType', 'qn.id'],
        ['qualificationType.name', 'qt.name'],
        ['login', 'l.id'],
        ['loginColumn', 'e.login'],
        ['contractInfo', 'ci.id'],
    ]);

    /**
     * Constructor of User service
     * @param _defaultUserRepository
     * @param _logger
     * @param _uploadService
     * @param _loginService
     */
    public constructor(
        @Inject(EMPLOYEE_PROVIDERS_NAMES.DEFAULT_REPOSITORY)
        private readonly _defaultUserRepository: Repository<Employee>,
        private readonly _logger: EmployeeLogger,
        private readonly _uploadService: UploadService,
        @Inject(forwardRef(() => LoginService))
        private readonly _loginService: LoginService,
    ) {
        super();
    }

    async findEmployeesByIds(ids: number[]): Promise<Employee[]> {
        const data = await this._defaultUserRepository.find({
            where: { id: In(ids) },
        });

        return ids.map((id) => data.filter((elt) => elt.id === id)[0]);
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
        id?: number | Employee,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        if (id instanceof Employee) id = id.id;

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
        id?: number | Employee,
        withDeleted?: boolean,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (!value) {
                resolve(false);
                return;
            }

            if (id instanceof Employee) id = id.id;

            const qb = this.getRepo(repo)
                .createQueryBuilder('e', manager?.queryRunner)
                .leftJoin('e.login', 'l');

            // Add with deleted at
            if (withDeleted) qb.withDeleted();

            qb.select(`COUNT(${this._cn('id')}) AS total`);

            if (Employee.isCryptColumn(column)) {
                qb.andWhereCrypt(
                    `${this._cn(column)} ILIKE :column_value`,
                    { column_value: value },
                    'LIKE',
                );
            } else if (Employee.isColumnString(column)) {
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

            const { total } = await qb.getRawOne();

            resolve(parseInt(total) > 0);
        });
    }

    /**
     * Return the user for action logs
     * @param user
     * @param repo
     * @param manager
     * @returns
     */
    public async findUserForActionLog(
        user: any,
        repo?: string,
        manager?: EntityManager,
    ): Promise<Employee> {
        if (user) {
            return this.getRepo(repo)
                .createQueryBuilder('e', manager?.queryRunner)
                .andWhere('e.id = :id', { id: user.id })
                .getOne();
        }
        return;
    }

    /**
     * Return all quick access
     * @param repo
     * @returns
     */
    public async findAll(
        filter?: EmployeeFilterArgInput,
        sort?: DatabaseSortArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<Employee[]> {
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
    public async findEmployeesAndPaginationAll(
        filter: EmployeeFilterArgInput,
        sort: DatabaseSortArg,
        pagination: PaginationArg,
        repo?: string,
        manager?: EntityManager,
    ): Promise<EmployeePaginationResultInterface> {
        const qb = this._initSelect(repo, manager);

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
        id: number | Employee,
        repo?: string,
        manager?: EntityManager,
    ): Promise<Employee> {
        if (id instanceof Employee) id = id.id;
        return this.findByColumn('id', id, repo, manager);
    }

    /**
     * Return an existing user by his column value
     * @param column
     * @param value
     * @param repo
     * @param manager
     */
    public async findByColumn(
        column: string,
        value: any,
        repo?: string,
        manager?: EntityManager,
    ): Promise<Employee> {
        const qb = this._initSelect(repo, manager);

        if (Employee.isCryptColumn(column)) {
            qb.andWhereCrypt(
                `${this._cn(column)} ILIKE :column_value`,
                { column_value: value },
                'LIKE',
            );
        } else if (Employee.isColumnString(column)) {
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
     * Find the employee number
     * @param repo
     * @param manager
     */
    public async findCurrentNumber(
        repo?: string,
        manager?: EntityManager,
    ): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const result = await this.getRepo(repo)
                .createQueryBuilder('e', manager?.queryRunner)
                .select('e.number', 'lastNumber')
                .withDeleted()
                .limit(1)
                .orderBy('e.id', 'DESC')
                .getRawOne();

            if (result && result.lastNumber) {
                const newNumber = parseInt(result.lastNumber) + 1;
                resolve(formatNumber(newNumber, EMPLOYEE_NUMBER_LENGTH));
            } else {
                resolve(formatNumber(1, EMPLOYEE_NUMBER_LENGTH));
            }
        });
    }

    /**
     * Create new Quick Access
     * @param data
     * @param repo
     * @param manager
     * @returns
     */
    public async create(
        data: EmployeeCreateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<Employee> {
        return this.useTransaction(async (transaction) => {
            // Init new Entity Quick Access
            const employee = new Employee();

            // Get uploaded file
            const { picture, ...rest } = data;

            // Save Picture
            if (picture) {
                employee.picture =
                    await this._uploadService.saveFromGraphqlUpload(
                        picture,
                        null,
                        null,
                        null,
                        null,
                        transaction,
                    );
            }

            employee.number = await this.findCurrentNumber(repo, transaction);

            // Set Data
            Object.assign(employee, rest);

            // Save hit
            const result = await transaction.save(employee);

            if (result) {
                // Abandonné sous demande de client réunion 12-07-2023
                // if (
                //   data.type === EmployeeTypeEnum.EMPLOYEE ||
                //   data.type === EmployeeTypeEnum.INTERIM
                // ) {
                //   result.login = await this._loginService.create(
                //     {
                //       employee: result,
                //       email: result.emailPro,
                //       active: true,
                //     },
                //     null,
                //     transaction,
                //   );
                //
                //   // Update employee
                //   const result2 = await transaction.save(result);
                //
                //   return this.findOne(result2.id, repo, transaction);
                // }

                this._logger.create(employee);

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
        data: EmployeeUpdateArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<Employee> {
        return this.useTransaction(async (transaction) => {
            // Extract ID
            const { id, picture, ...req } = data;

            // Find existing
            const oldEmployee = await this.findOne(id, repo, transaction);

            if (oldEmployee) {
                // Set old data
                this._logger.setData(oldEmployee);

                // Save Picture
                if (picture) {
                    oldEmployee.picture =
                        await this._uploadService.saveFromGraphqlUpload(
                            picture,
                            null,
                            null,
                            oldEmployee.picture,
                            null,
                            transaction,
                        );
                }

                // Abandonné sous demande de client réunion 12-07-2023
                // Create login
                // if (
                //   oldEmployee.type === EmployeeTypeEnum.CANDIDATE &&
                //   (data.type === EmployeeTypeEnum.EMPLOYEE ||
                //     data.type === EmployeeTypeEnum.INTERIM) &&
                //   !oldEmployee.login
                // ) {
                //   oldEmployee.login = await this._loginService.create(
                //     {
                //       employee: oldEmployee,
                //       email: oldEmployee.emailPro,
                //       active: true,
                //     },
                //     null,
                //     transaction,
                //   );
                // }

                // Add new Data
                Object.assign(oldEmployee, req);

                // Save Data
                const result = await transaction.save(oldEmployee);

                if (result) {
                    this._logger.update(oldEmployee);

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
        req: EmployeeRemoveArgInput,
        repo?: string,
        manager?: EntityManager,
    ): Promise<boolean> {
        return this.useTransaction(async (transaction) => {
            if (req && req.id && req.type) {
                let { id, type } = req;

                id = id instanceof Employee ? id.id : id;
                const employee = await this.findOne(id, repo, transaction);

                if (employee instanceof Employee) {
                    if (type === REMOVE_TYPES.HARD) {
                        if (employee.picture) {
                            await this._uploadService.remove(
                                {
                                    id: employee.picture,
                                    type: type,
                                },
                                null,
                                transaction,
                            );
                        }

                        await transaction.delete(Employee, employee.id);

                        this._logger.delete(employee);
                    } else {
                        await transaction.softDelete(Employee, employee.id);

                        this._logger.softDelete(employee);
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
     * Init Select Query Builder
     * @param repo
     * @returns
     */
    private _initSelect(
        repo?: string,
        manager?: EntityManager,
    ): SelectQueryBuilder<Employee> {
        const qb = this.getRepo(repo)
            .createQueryBuilder('e', manager?.queryRunner)
            // .leftJoinAndSelect('e.roles', 'r')
            // .leftJoinAndSelect('r.permissions', 'p')
            .leftJoinAndSelect('e.login', 'l')
            .leftJoinAndSelect('l.tokens', 't')
            .leftJoinAndSelect('e.picture', 'pic')
            .leftJoinAndSelect('e.department', 'd')
            .leftJoinAndSelect('e.qualifications', 'q')
            .leftJoinAndSelect('q.name', 'qn')
            .leftJoinAndSelect('q.type', 'qt')
            .leftJoinAndSelect('e.boss', 'b')
            .leftJoinAndSelect('e.employees', 'es')
            .leftJoinAndSelect('e.superior', 's')
            .leftJoinAndSelect('e.collaborators', 'c')
            .leftJoinAndSelect('e.companyDeparture', 'cd')
            .leftJoinAndSelect('e.entity', 'ee')
            .leftJoinAndSelect('e.contracts', 'cont')
            .leftJoinAndSelect('e.contractInfo', 'ci')
            .leftJoinAndSelect('ci.typeEntry', 'typeEntry')
            .leftJoinAndSelect('ci.level', 'level')
            .leftJoinAndSelect('ci.section', 'section')
            .leftJoinAndSelect('ci.apprentice', 'apprentice')
            .leftJoinAndSelect('ci.jobDescription', 'jd')
            .leftJoinAndSelect('e.employeeDisciplinarys', 'ed')
            .leftJoinAndSelect('e.materialParks', 'mp');

        return qb;
    }

    /**
     * Apply user filter
     * @param qb
     * @param sort
     */
    private async _applyFilter(
        qb: SelectQueryBuilder<Employee>,
        filter?: EmployeeFilterArgInput,
        sort?: DatabaseSortArg,
    ): Promise<void> {
        if (filter) {
            if (filter.id)
                qb.andWhere(`${this._cn('id')} = :id`, { id: filter.id });

            if (filter.ids?.length)
                qb.andWhere(`${this._cn('id')} IN (:...id)`, {
                    id: filter.ids,
                });

            if (filter.search) {
                qb.andWhere(
                    new Brackets((_qb) => {
                        // For normal
                        _qb.orWhere(`${this._cn('number')} ILIKE :search`, {
                            search: `%${filter.search}%`,
                        });
                        _qb.orWhere(`${this._cn('phonePro')} ILIKE :search`, {
                            search: `%${filter.search}%`,
                        });
                        _qb.orWhere(
                            `${this._cn('phoneFixPro')} ILIKE :search`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );
                        _qb.orWhere(`${this._cn('phonePerso')} ILIKE :search`, {
                            search: `%${filter.search}%`,
                        });
                        _qb.orWhere(
                            `${this._cn('phoneFixPerso')} ILIKE :search`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );
                        _qb.orWhere(
                            `${this._cn('phoneShortcut')} ILIKE :search`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );
                        _qb.orWhere(
                            `${this._cn('internalNumber')} ILIKE :search`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );
                        _qb.orWhere(`${this._cn('cityBirth')} ILIKE :search`, {
                            search: `%${filter.search}%`,
                        });
                        _qb.orWhere(`${this._cn('address')} ILIKE :search`, {
                            search: `%${filter.search}%`,
                        });
                        _qb.orWhere(`${this._cn('postcode')} ILIKE :search`, {
                            search: `%${filter.search}%`,
                        });
                        _qb.orWhere(`${this._cn('city')} ILIKE :search`, {
                            search: `%${filter.search}%`,
                        });
                        _qb.orWhere(`${this._cn('country')} ILIKE :search`, {
                            search: `%${filter.search}%`,
                        });
                        _qb.orWhere(`${this._cn('createdBy')} ILIKE :search`, {
                            search: `%${filter.search}%`,
                        });
                        _qb.orWhere(`${this._cn('updatedBy')} ILIKE :search`, {
                            search: `%${filter.search}%`,
                        });
                        _qb.orWhere(
                            `${this._cn('nationality')} ILIKE :search`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );
                        _qb.orWhere(
                            `${this._cn('countryBirth')} ILIKE :search`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );
                        _qb.orWhere(
                            `${this._cn('secureNumber')} ILIKE :search`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );
                        _qb.orWhere(
                            `${this._cn('residencePermit')} ILIKE :search`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );
                        _qb.orWhere(
                            `${this._cn('rpDeliveryBy')} ILIKE :search`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );
                        _qb.orWhere(`${this._cn('bank')} ILIKE :search`, {
                            search: `%${filter.search}%`,
                        });
                        _qb.orWhere(`${this._cn('position')} ILIKE :search`, {
                            search: `%${filter.search}%`,
                        });
                        _qb.orWhere(`${this._cn('rib')} ILIKE :search`, {
                            search: `%${filter.search}%`,
                        });
                        _qb.orWhere(
                            `${this._cn(
                                'qualificationName.name',
                            )} ILIKE :search`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );
                        _qb.orWhere(
                            `${this._cn(
                                'qualificationType.name',
                            )} ILIKE :search`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );

                        // Search for enum
                        _qb.orWhere(
                            `${this._cn('diplome')}::text ILIKE :search`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );
                        _qb.orWhere(
                            `${this._cn('gender')}::text ILIKE :search`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );
                        _qb.orWhere(
                            `(${this._cn('familyStatus')})::text ILIKE :search`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );
                        _qb.orWhere(
                            `${this._cn('title')}::text ILIKE :search`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );
                        _qb.orWhere(
                            `(${this._cn('type')})::text ILIKE :search`,
                            {
                                search: `%${filter.search}%`,
                            },
                        );

                        // For CRYPT
                        _qb.orWhereCrypt(
                            `${this._cn('emailPro')} ILIKE :csearch`,
                            { csearch: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('emailPerso')} ILIKE :csearch`,
                            { csearch: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('lastname')} ILIKE :csearch`,
                            { csearch: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('lastnameBis')} ILIKE :csearch`,
                            { csearch: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('firstname')} ILIKE :csearch`,
                            { csearch: filter.search },
                            'LIKE',
                        );
                        _qb.orWhereCrypt(
                            `${this._cn('username')} ILIKE :csearch`,
                            { csearch: filter.search },
                            'LIKE',
                        );

                        // For number
                        if (filter.search.match(/^[0-9]+((\.|\,)[0-9]+)?$/)) {
                            _qb.orWhere(
                                `${this._cn('numberOfChildren')} = :search`,
                                {
                                    search: filter.search,
                                },
                            );
                        }
                    }),
                );
            }

            if (filter.entities?.length)
                qb.andWhere(`${this._cn('entity')} IN (:...entities)`, {
                    entities: filter.entities,
                });

            if (filter.departments?.length)
                qb.andWhere(`${this._cn('department')} IN (:...departments)`, {
                    departments: filter.departments,
                });

            if (filter.qualificationsNames?.length)
                qb.andWhere(
                    `${this._cn(
                        'qualificationsNames',
                    )} IN (:...qualificationsNames)`,
                    { qualificationsNames: filter.qualificationsNames },
                );

            if (filter.genders?.length)
                qb.andWhere(`${this._cn('gender')} IN (:...genders)`, {
                    genders: filter.genders,
                });

            if (filter.statuses?.length)
                qb.andWhere(`${this._cn('active')} IN (:...statuses)`, {
                    statuses: filter.statuses,
                });

            if (filter.type)
                qb.andWhere(`(${this._cn('type')})::text ILIKE :type`, {
                    type: `%${filter.type}%`,
                });

            if (filter.types?.length)
                qb.andWhere(`(${this._cn('type')})::text IN (:...types)`, {
                    types: filter.types,
                });

            if (filter.hasNotLogin)
                qb.andWhere(`(${this._cn('loginColumn')}) IS NULL`);
        }

        qb.sortResult(sort, (columnName) => this._cn(columnName));
    }

    public getRepo(repo?: string): Repository<Employee> {
        return this._defaultUserRepository;
    }

    /**
     * Return the column name for query builder
     * @param columnName
     * @returns
     */
    private _cn(columnName?: string): string | undefined {
        return EmployeeService.ColumnQueryNames.get(columnName);
    }
}
