import {
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
import { CryptColumn } from '../../libs/databases/decorators/columns/CryptColumn';
import { CreatedByColumn } from '../../libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from '../../libs/databases/decorators/columns/UpdatedByColumn';
import { CustomerEntity } from './CustomerEntity';
import { UploadEntity } from './UploadEntity';
import { BusinessPaymentModeEntity } from './BusinessPaymentModeEntity';
import { BusinessPaymentTypeEntity } from './BusinessPaymentTypeEntity';
import { BusinessTenderTypeEntity } from './BusinessTenderTypeEntity';
import { BusinessMarketTypeEntity } from './BusinessMarketTypeEntity';
import { Employee } from './EmployeeEntity';
import { BusinessUnitEnum } from '../../modules/business/dto/enums/business-unit.enum';
import { BusinessBatchEntity } from './BusinessBatchEntity';
import { BusinessStatusEnum } from '../../modules/business/dto/enums/business-status.enum';
import { BusinessTypeEnum } from '../../modules/business/dto/enums/business-type.enum';
import { BusinessDocumentEntity } from './BusinessDocumentEntity';
import { BusinessBudgetEntity } from './BusinessBudgetEntity';

@Entity({ name: 'business' })
export class BusinessEntity {
    public constructor(data?: BusinessEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * The id
     */
    @PrimaryGeneratedColumn()
    public id?: number;

    @ManyToOne(() => CustomerEntity, (customer) => customer.businesses, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public customer?: CustomerEntity;

    @ManyToOne(() => BusinessPaymentModeEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public paymentMode?: BusinessPaymentModeEntity;

    @ManyToOne(() => BusinessPaymentTypeEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public paymentType?: BusinessPaymentTypeEntity;

    @ManyToOne(() => BusinessTenderTypeEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public tenderType?: BusinessTenderTypeEntity;

    @ManyToOne(() => BusinessMarketTypeEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public marketType?: BusinessMarketTypeEntity;

    @ManyToOne(() => Employee, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public worksChief?: Employee;

    @ManyToOne(() => Employee, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public worksManager?: Employee;

    @ManyToOne(() => Employee, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public mainSiteManager?: Employee;

    @ManyToOne(() => Employee, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public siteManager2?: Employee;

    @ManyToOne(() => Employee, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public siteManager3?: Employee;

    @ManyToOne(() => Employee, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public commercial?: Employee;

    @ManyToOne(() => UploadEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public picture?: UploadEntity;

    /**
     * The batches
     */
    @OneToMany(() => BusinessBatchEntity, (batch) => batch.business, {
        onDelete: 'CASCADE',
    })
    public batches?: BusinessBatchEntity[];

    /**
     * The budges
     */
    @OneToMany(() => BusinessBudgetEntity, (budge) => budge.entity, {
        onDelete: 'CASCADE',
    })
    public budges?: BusinessBudgetEntity[];

    /**
     * The documents
     */
    @OneToMany(() => BusinessDocumentEntity, (batch) => batch.business, {
        onDelete: 'CASCADE',
    })
    public documents?: BusinessDocumentEntity[];

    @CryptColumn({
        nullable: true,
    })
    public email?: string;

    @Column({
        nullable: true,
    })
    public code?: string;

    @Column({
        nullable: true,
    })
    public label?: string;

    @Column({
        nullable: true,
    })
    public externalCode?: string;

    @Column({
        nullable: true,
    })
    public payingOwner?: string;

    @Column({
        nullable: true,
    })
    public mainOwner?: string;

    @Column({
        type: 'boolean',
        default: false,
        nullable: true,
    })
    public underCover?: boolean;

    @Column({
        nullable: true,
    })
    public owner?: string;

    @Column({
        nullable: true,
    })
    public origin?: string;

    @Column({
        type: 'numeric',
        nullable: true,
        precision: 14,
        scale: 2,
    })
    public estimatedAmount?: number;

    @Column({
        nullable: true,
    })
    public referenceCase?: string;

    @Column({
        nullable: true,
        type: 'boolean',
        default: false,
    })
    public bidBond?: boolean;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    public startDate?: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    public endDate?: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    public startDateStudy?: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    public endDateStudy?: Date;

    @Column({
        type: 'integer',
        nullable: true,
    })
    public workDuration?: number;

    @Column({
        type: 'enum',
        enum: BusinessUnitEnum,
        nullable: true,
    })
    public unit?: BusinessUnitEnum;

    @Column({
        type: 'enum',
        enum: BusinessTypeEnum,
        nullable: true,
    })
    public type?: BusinessTypeEnum;

    @Column({
        type: 'enum',
        enum: BusinessStatusEnum,
        nullable: true,
    })
    public status?: BusinessStatusEnum;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    public abandonedAt?: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    public applicationDate?: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    public retrieveDate?: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    public limiteDate?: Date;

    @Column({
        type: 'timestamp',
        nullable: true,
    })
    public depositDate?: Date;

    @Column({
        nullable: true,
    })
    public agency?: string;

    @Column({
        nullable: true,
    })
    public address?: string;

    @Column({
        nullable: true,
    })
    public postalCode?: string;

    @Column({
        nullable: true,
    })
    public city?: string;

    @Column({
        nullable: true,
    })
    public country?: string;

    @Column({
        nullable: true,
    })
    public phone?: string;

    @Column({
        nullable: true,
    })
    public website?: string;

    @Column({
        nullable: true,
    })
    public gps?: string;

    @Column({
        nullable: true,
    })
    public delegatedCustomer?: string;

    @Column({
        nullable: true,
    })
    public economist?: string;

    @Column({
        nullable: true,
    })
    public engineeringOffice?: string;

    @Column({
        nullable: true,
    })
    public fuildEngineeringOffice?: string;

    @Column({
        nullable: true,
    })
    public groundEngineeringOffice?: string;

    @Column({
        nullable: true,
    })
    public controlOffice?: string;

    @Column({
        nullable: true,
    })
    public pilot?: string;

    @Column({
        nullable: true,
    })
    public safetyCoordinator?: string;

    /**
     * Is editable
     */
    @Column({
        type: 'boolean',
        nullable: true,
    })
    public isEditable?: boolean;

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
     * Check if is crypt column
     * @param name
     * @returns
     */
    public static isCryptColumn(name?: string): boolean {
        return !!name?.match(/^(email)$/i);
    }

    /**
     * Check if column name is string
     */
    public static isColumnString(value?: string): boolean {
        return !!value?.match(
            /^(code|label|externalCode|payingOwner|mainOwner|owner|origin|referenceCase|agency|address|postalCode|city|country|phone|website|gps|delegatedCustomer|economist|engineeringOffice|fuildEngineeringOffice|groundEngineeringOffice|controlOffice|pilot|safetyCoordinator|createdBy|updatedBy)$/i,
        );
    }

    /**
     * Return an instance of BusinessEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): BusinessEntity {
        return id ? new BusinessEntity({ id: id }) : null;
    }
}
