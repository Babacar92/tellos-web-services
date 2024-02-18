import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { CreatedByColumn } from '@Libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from '@Libs/databases/decorators/columns/UpdatedByColumn';
import { GOOD_STATUS } from '@Modules/good/enums/good-status.enum';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

//Entities
import { Supplier } from './supplier.entity';
import { SectionCodeEntity } from './SectionCodeEntity';
import { ArticleFamilyEntity } from './ArticleFamilyEntity';
import { WorkUnitEntity } from './WorkUnitEntity';

@ObjectType()
@Entity({
    name: 'good',
})
@Unique(['name', 'deletedAt'])
export class Good {
    /**
     * The constructor of Category Equipment
     * @param data
     */
    public constructor(data?: Partial<Good>) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Category Equipment
     */
    @PrimaryGeneratedColumn()
    @Field((type) => Int, { nullable: true })
    public id?: number;

    /**
     * The name
     */
    @Column({})
    @Field({ nullable: true })
    public name?: string;

    /**
     * The second name
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public nameBis?: string;

    /**
     * The good is in shop
     */
    @Column({
        type: 'boolean',
        default: false,
    })
    @Field({ nullable: true })
    public shopGood?: boolean;

    /**
     * status
     */
    @Column({
        type: 'enum',
        enum: GOOD_STATUS,
        nullable: true,
    })
    @Field((type) => GOOD_STATUS, { nullable: true })
    public status?: GOOD_STATUS;

    /**
     * Ean code
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public ean?: string;

    /**
     * Length
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
        precision: 20,
        scale: 2,
    })
    @Field((type) => Float, { nullable: true })
    public lengthSize?: number;

    /**
     * Width
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
        precision: 20,
        scale: 2,
    })
    @Field((type) => Float, { nullable: true })
    public widthSize?: number;

    /**
     * Height
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
        precision: 20,
        scale: 2,
    })
    @Field((type) => Float, { nullable: true })
    public heightSize?: number;

    /**
     * Volume
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
        precision: 20,
        scale: 2,
    })
    @Field((type) => Float, { nullable: true })
    public volume?: number;

    /**
     * Gross weight
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
        precision: 20,
        scale: 2,
    })
    @Field((type) => Float, { nullable: true })
    public grossWeight?: number;

    /**
     * Net weight
     */
    @Column({
        type: 'numeric',
        nullable: true,
        unsigned: true,
        precision: 20,
        scale: 2,
    })
    @Field((type) => Float, { nullable: true })
    public netWeight?: number;

    /**
     * Technical Description
     */
    @Column({
        type: 'text',
        nullable: true,
    })
    @Field({ nullable: true })
    public technicalDescription?: string;

    /**
     * Selection Active mode
     */
    @Column({
        type: 'boolean',
        default: false,
    })
    @Field({ nullable: true })
    public selectionActive?: boolean;

    /**
     * Has Stock management
     */
    @Column({
        type: 'boolean',
        default: false,
    })
    @Field({ nullable: true })
    public stockManagement?: boolean;

    /**
     * Is the article generic?
     */
    @Column({
        type: 'boolean',
        default: false,
    })
    @Field({ nullable: true })
    public isGeneric?: boolean;

    /**
     * The work unit of the good
     */
    @ManyToOne(() => WorkUnitEntity, (workUnit) => workUnit.goods, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    @Field((type) => WorkUnitEntity, { nullable: true })
    public workUnit?: WorkUnitEntity;

    // Add the link to supplier
    @ManyToOne(() => Supplier, {})
    @JoinColumn({ name: 'supplier_id' })
    supplier?: Supplier;

    @Column({ name: 'supplier_id', nullable: true })
    public supplierId: number;

    /**
     * The section code of the good
     */
    @ManyToOne(() => SectionCodeEntity, (sectionCode) => sectionCode.goods, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    @Field((type) => SectionCodeEntity, { nullable: true })
    public sectionCode?: SectionCodeEntity;

    /**
     * The article family of the good
     */
    @ManyToOne(() => ArticleFamilyEntity, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    @Field((type) => ArticleFamilyEntity, { nullable: true })
    public parentFamily?: ArticleFamilyEntity;

    /**
     * The article family of the good
     */
    @ManyToOne(() => ArticleFamilyEntity, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    @Field((type) => ArticleFamilyEntity, { nullable: true })
    public subFamily?: ArticleFamilyEntity;

    /**
     * Active mode
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
        return !!value.match(/^(title|createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of GoodEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): Good {
        return id ? new Good({ id: id }) : null;
    }
}
