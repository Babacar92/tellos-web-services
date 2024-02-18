import {
    AfterLoad,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { EntityEntity } from './EntityEntity';
import { DepartmentEntity } from './DepartmentEntity';
import { ContractInfoEntity } from './ContractInfoEntity';
import { UploadEntity } from './UploadEntity';

@Entity({
    name: 'job_description',
})
export class JobDescriptionEntity {
    /**
     * The constructor of Job Description Entity
     * @param data
     */
    public constructor(data?: JobDescriptionEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of JobDescription
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * The entity
     */
    @ManyToOne(() => EntityEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public entity?: EntityEntity;

    /**
     * The department
     */
    @ManyToOne(() => DepartmentEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public department?: DepartmentEntity;

    /**
     * The contracts infos
     */
    @OneToMany(
        () => ContractInfoEntity,
        (contractInfo) => contractInfo.jobDescription,
        {},
    )
    public contractsInfos?: ContractInfoEntity[];

    /**
     * Number of Job Description
     */
    @Column({
        nullable: true,
    })
    public number?: string;

    /**
     * title
     */
    @Column({
        nullable: true,
        type: 'text',
    })
    public title?: string;

    /**
     * Descritption
     */
    @Column({
        nullable: true,
        type: 'text',
    })
    public description?: string;

    /**
     * The file of Document
     */
    @ManyToOne(() => UploadEntity, null, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public file?: UploadEntity;

    /**
     * Is enable
     */
    @Column({
        type: 'boolean',
        default: false,
    })
    public active?: boolean;

    /**
     * Created column
     */
    @CreateDateColumn({
        // ...
    })
    public createdAt?: Date;

    /**
     * Updated column
     */
    @UpdateDateColumn({
        // ...
    })
    public updatedAt?: Date;

    /**
     * Deleted column
     */
    @DeleteDateColumn({
        //
    })
    public deletedAt?: Date;

    /**
     * Creator column
     */
    @CreatedByColumn()
    public createdBy?: string;

    /**
     * Editor column
     */
    @UpdatedByColumn()
    public updatedBy?: string;

    /**
     * The total employees
     */
    public totalEmployees?: number;

    @AfterLoad()
    public afterLoad?(): void {
        this.totalEmployees = this.contractsInfos?.length || 0;
    }

    /**
     * Check if column name is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(
            /^(number|title|description|createdBy|updatedBy)$/i,
        );
    }

    /**
     * Return an instance of JobDescriptionEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): JobDescriptionEntity {
        return id ? new JobDescriptionEntity({ id: id }) : null;
    }
}
