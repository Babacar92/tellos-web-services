import {
    AfterLoad,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import {
    CONTRACT_AGE_CATEGORY,
    CONTRACT_CATEGORY,
    CONTRACT_LEAVING_REASON,
    CONTRACT_RENEWAL,
} from '../../modules/contract-info/dto/enums/contract-info.enum';
import { ContractTypeEntryEntity } from './ContractTypeEntryEntity';
import { ContractTypePaymentEntity } from './ContractTypePaymentEntity';
import { ContractApprenticeEntity } from './ContractApprenticeEntity';
import { ContractSectionEntity } from './ContractSectionEntity';
import { ContractLevelEntity } from './ContractLevelEntity';
import { Employee } from './EmployeeEntity';
import { CreatedByColumn } from '../../libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from '../../libs/databases/decorators/columns/UpdatedByColumn';
import { getSeniorityYears } from '../../utils/utils';
import { JobDescriptionEntity } from './JobDescriptionEntity';
import { ContractEnum } from '../../modules/employee/dto/enums/employee.contract.enum';

@Entity({
    name: 'contract_info',
})
export class ContractInfoEntity {
    /**
     * The constructor of Contract Entity
     * @param data
     */
    public constructor(data?: ContractInfoEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Contract
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    /**
     * contract of employee
     */
    @OneToOne(() => Employee, (employee) => employee.contractInfo, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    public employee?: Employee;

    /**
     * type of contract
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: ContractEnum,
    })
    public typeContract?: ContractEnum;

    /**
     * type entry of contract
     */
    @ManyToOne(() => ContractTypeEntryEntity, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public typeEntry?: ContractTypeEntryEntity;

    /**
     * type payment of contract
     */
    @ManyToOne(() => ContractTypePaymentEntity, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public typePayment?: ContractTypePaymentEntity;

    /**
     * aprrenctice of contract
     */
    @ManyToOne(() => ContractApprenticeEntity, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public apprentice?: ContractApprenticeEntity;

    /**
     * section of contract
     */
    @ManyToOne(() => ContractSectionEntity, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public section?: ContractSectionEntity;

    /**
     * level of contract
     */
    @ManyToOne(() => ContractLevelEntity, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    public level?: ContractLevelEntity;

    /**
     * Job description
     */
    @ManyToOne(() => JobDescriptionEntity, (job) => job.contractsInfos, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public jobDescription?: JobDescriptionEntity;

    /**
     * entry date of contract
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public entryDate?: Date;

    /**
     * Seniority date of contract
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public seniorityDate?: Date;

    /**
     * SAGE pay code of contract
     */
    @Column({
        nullable: true,
    })
    public sagePayCode?: string;

    /**
     * end of trial of contract
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public endTrialPeriod?: Date;

    /**
     * renewal of contract
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: CONTRACT_RENEWAL,
    })
    public renewal?: CONTRACT_RENEWAL;

    /**
     * end renewal of contract
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public endRenewal?: Date;

    /**
     * end of contract CDD
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public endContractCdd?: Date;

    /**
     * amendment CDD
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public amendmentCdd?: Date;

    /**
     * Date of departure
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    public departureDate?: Date;

    /**
     * reason for leaving
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: CONTRACT_LEAVING_REASON,
    })
    public leavingRaison?: CONTRACT_LEAVING_REASON;

    /**
     * job
     */
    @Column({
        nullable: true,
        type: 'text',
    })
    public job?: string;

    /**
     * category of contract employee
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: CONTRACT_CATEGORY,
    })
    public category?: CONTRACT_CATEGORY;

    /**
     * code INSEE of contract employee
     */
    @Column({
        nullable: true,
    })
    public code?: string;

    /**
     * position of contract
     */
    @Column({
        nullable: true,
    })
    public position?: string;

    /**
     * coefficient
     */
    @Column({
        nullable: true,
    })
    public coefficient?: string;

    /**
     *large rate dep
     */
    @Column({
        nullable: true,
    })
    public largeRateDep?: string;

    /**
     * age category
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: CONTRACT_AGE_CATEGORY,
    })
    public ageCategory?: CONTRACT_AGE_CATEGORY;

    /**
     * Is enable
     */
    @Column({
        type: 'boolean',
        default: true,
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
     * senioriy years of contract
     */
    public seniorityYears?: number;

    /**
     * Check if column name is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(/^(job|createdBy|updatedBy)$/i);
    }

    @AfterLoad()
    public afterload?(): void {
        if (this.entryDate && this.seniorityDate) {
            this.seniorityYears = getSeniorityYears(
                this.entryDate,
                this.seniorityDate,
            );
        }
    }

    /**
     * Return an instance of ContractInfoEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): ContractInfoEntity {
        return id ? new ContractInfoEntity({ id: id }) : null;
    }
}
