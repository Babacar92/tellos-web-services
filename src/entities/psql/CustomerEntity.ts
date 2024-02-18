import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { CryptColumn } from 'src/libs/databases/decorators/columns/CryptColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { CustomerTypeEnum } from 'src/modules/customer/dto/enum/customer-type.enum';
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { UploadEntity } from './UploadEntity';
import { CustomerContactEntity } from './CustomerContactEntity';
import { CustomerTypologyEnum } from 'src/modules/customer/dto/enum/customer-typology.enum';
import { CustomerCurrencyEnum } from 'src/modules/customer/dto/enum/customer-currency.enum';
import { CustomerLanguageEnum } from 'src/modules/customer/dto/enum/customer-language.enum';
import { CustomerTaxEnum } from 'src/modules/customer/dto/enum/customer-tax.enum';
import { CustomerNoteEntity } from './CustomerNoteEntity';
import { CustomerDocumentEntity } from './CustomerDocumentEntity';
import { CustomerTimelineEntity } from './CustomerTimelineEntity';
import { BusinessEntity } from './BusinessEntity';
import { RegulationCodeEntity } from './RegulationCodeEntity';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'customer' })
@Unique(['name', 'deletedAt'])
@Unique(['email', 'deletedAt'])
@Unique(['code', 'deletedAt'])
@Unique(['siret', 'deletedAt'])
@Unique(['ape', 'deletedAt'])
@Unique(['tvaNumber', 'deletedAt'])
@Unique(['rib', 'deletedAt'])
@Unique(['iban', 'deletedAt'])
@Unique(['bic', 'deletedAt'])
@Unique(['invoiceEmail', 'deletedAt'])
export class CustomerEntity {
    public constructor(data?: CustomerEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Customer
     */
    @PrimaryGeneratedColumn()
    @Field((type) => Int, { nullable: true })
    public id?: number;

    /**
     * Picture of customer
     */
    @ManyToOne(() => UploadEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    @Field((type) => UploadEntity, { nullable: true })
    public picture?: UploadEntity;

    /**
     * Contacts of customer
     */
    @OneToMany(() => CustomerContactEntity, (contact) => contact.customer, {
        onDelete: 'SET NULL',
    })
    @Field((type) => [CustomerContactEntity], { nullable: true })
    public contacts?: CustomerContactEntity[];

    /**
     * Notes of customer
     */
    @OneToMany(() => CustomerNoteEntity, (note) => note.customer, {
        onDelete: 'SET NULL',
    })
    @Field((type) => [CustomerNoteEntity], { nullable: true })
    public notes?: CustomerNoteEntity[];

    /**
     * Documents of customer
     */
    @Field((type) => [CustomerDocumentEntity], { nullable: true })
    @OneToMany(() => CustomerDocumentEntity, (document) => document.customer, {
        onDelete: 'SET NULL',
    })
    public documents?: CustomerDocumentEntity[];

    /**
     * Documents of customer
     */
    @OneToMany(() => CustomerTimelineEntity, (document) => document.customer, {
        onDelete: 'SET NULL',
    })
    @Field((type) => [CustomerTimelineEntity], { nullable: true })
    public timelines?: CustomerTimelineEntity[];

    /**
     * Businesses of customer
     */
    @OneToMany(() => BusinessEntity, (business) => business.customer, {
        onDelete: 'SET NULL',
    })
    @Field((type) => [BusinessEntity], { nullable: true })
    public businesses?: BusinessEntity[];

    /**
     * Name of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public name?: string;

    /**
     * Email of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public email?: string;

    /**
     * Code of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public code?: string;

    /**
     * Address of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public address?: string;

    /**
     * AddressBis of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public addressBis?: string;

    /**
     * ZipCode of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public zipCode?: string;

    /**
     * City of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public city?: string;

    /**
     * Country of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    public country?: string;

    /**
     * Familly of Customer
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: CustomerTypeEnum,
    })
    @Field((type) => CustomerTypeEnum, { nullable: true })
    public familly?: CustomerTypeEnum;

    /**
     * Typology of Customer
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: CustomerTypologyEnum,
    })
    @Field((type) => CustomerTypologyEnum, { nullable: true })
    public typology?: CustomerTypologyEnum;

    /**
     * Language of Customer
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: CustomerLanguageEnum,
    })
    @Field((type) => CustomerLanguageEnum, { nullable: true })
    public language?: CustomerLanguageEnum;

    /**
     * Phone of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public phone?: string;

    /**
     * Fax of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public fax?: string;

    /**
     * Siret of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public siret?: string;

    /**
     * Ape of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public ape?: string;

    /**
     * TvaNumber of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public tvaNumber?: string;

    /**
     * TaxeCode of Customer
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: CustomerTaxEnum,
    })
    @Field({ nullable: true })
    public taxeCode?: CustomerTaxEnum;

    /**
     * RegulationCode of Customer
     */
    @ManyToOne(
        () => RegulationCodeEntity,
        (regulationCode) => regulationCode.customers,
        {
            onDelete: 'SET NULL',
            nullable: true,
        },
    )
    @JoinColumn()
    @Field((type) => RegulationCodeEntity, { nullable: true })
    public regulationCode?: RegulationCodeEntity;

    /**
     * Currency of Customer
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: CustomerCurrencyEnum,
    })
    @Field((type) => CustomerCurrencyEnum, { nullable: true })
    public currency?: CustomerCurrencyEnum;

    /**
     * Rib of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public rib?: string;

    /**
     * Domiciliation of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public domiciliation?: string;

    /**
     * Iban of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public iban?: string;

    /**
     * Bic of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public bic?: string;

    /**
     * InvoiceCopyNumber of Customer
     */
    @Column({
        type: 'integer',
        nullable: true,
    })
    @Field((type) => Float, { nullable: true })
    public invoiceCopyNumber?: number;

    /**
     * DiscountRate of Customer
     */
    @Column({
        type: 'float',
        nullable: true,
    })
    @Field((type) => Float, { nullable: true })
    public discountRate?: number;

    /**
     * InvoiceEmail of Customer
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public invoiceEmail?: string;

    /**
     * Is enable
     */
    @Column({
        type: 'boolean',
        default: true,
    })
    @Field({ nullable: true })
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
     * Check if column name is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(/^(createdBy|updatedBy)$/i);
    }

    /**
     * Check if is crypt column
     * @param name
     * @returns
     */
    public static isCryptColumn(name?: string): boolean {
        return !!name?.match(
            /^(name|email|code|address|addressBis|zipCode|city|country|phone|fax|siret|ape|tvaNumber|taxeCode|regulationCode|currency|rib|domiciliation|iban|bic|invoiceCopyNumber|discountrate|invoicEmail)$/i,
        );
    }

    public static init(id?: number): CustomerEntity {
        return id ? new CustomerEntity({ id: id }) : null;
    }
}
