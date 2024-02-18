import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
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
import { Employee } from './EmployeeEntity';
import { QualificationEntity } from './QualificationEntity';
import { UploadEntity } from './UploadEntity';
import { LeaveEntity } from './LeaveEntity';
import { MedicalVisitEntity } from './MedicalVisitEntity';
import { EntityType } from 'src/modules/entity/dto/enum/entity.type.enum';
import { AdministrativeMaterialEntity } from './AdministrativeMaterialEntity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EquipmentPark } from './equipment-park.entity';
import { StockPile } from './stock-pile.entity';

/**
 * The Entity Entity
 */
@ObjectType()
@Entity({ name: 'entity' })
@Unique(['label', 'deletedAt'])
export class EntityEntity {
    //stockpile: any;
    /**
     * The constructor of Entity Entity
     * @param data
     */
    public constructor(data?: EntityEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Entity
     */
    @PrimaryGeneratedColumn()
    @Field((type) => Int, { nullable: true })
    public id?: number;

    /**
     * Logo of Entity
     */
    @ManyToOne(() => UploadEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public logo?: UploadEntity;

    /**
     * Label of Entity
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public label?: string;

    /**
     * Label of Entity
     */
    @Column({
        default: '',
    })
    @Field()
    public identifierNumber?: string;

    /**
     * Organigramme of Entity
     */
    @ManyToOne(() => UploadEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    public organigramme?: UploadEntity;

    /**
     * List of employees of Entity
     */
    @OneToMany(() => Employee, (employee) => employee.entity, {})
    @Field((type) => [Employee], { nullable: true })
    public employees?: Employee[];

    /**
     * List of administrative material of Entity
     */
    @OneToMany(
        () => AdministrativeMaterialEntity,
        (adminMat) => adminMat.companyOwner,
        {},
    )
    @Field((type) => [AdministrativeMaterialEntity], { nullable: true })
    public administrativeEquipment?: AdministrativeMaterialEntity[];

    /**
     * List of employees of Entity
     */
    @OneToMany(() => LeaveEntity, (leave) => leave.entity, {})
    @Field((type) => [LeaveEntity], { nullable: true })
    public leaves?: LeaveEntity[];

    /**
     * List of employees of Entity
     */
    @OneToMany(
        () => MedicalVisitEntity,
        (medicalVisit) => medicalVisit.entity,
        {},
    )
    @Field((type) => [MedicalVisitEntity], { nullable: true })
    public medicalVisits?: MedicalVisitEntity[];

    /**
     * List of material park of Entity
     */
    @OneToMany(() => EquipmentPark, (equipmentPark) => equipmentPark.entity, {})
    @Field((type) => [EquipmentPark], { nullable: true })
    public equipmentParks?: EquipmentPark[];



    @OneToMany(() => StockPile, (stockpile) => stockpile.entity, {})
    @Field((type) => [StockPile], { nullable: true })
    public stockpiles?: StockPile[];

    

    /**
     * List of qualifications
     */
    @OneToMany(
        () => QualificationEntity,
        (qualification) => qualification.entity,
        {},
    )
    @Field((type) => QualificationEntity, { nullable: true })
    public qualifications?: QualificationEntity;

    /**
     * Number of employees of Entity
     */
    @Column({
        type: 'int',
        unsigned: true,
        nullable: true,
    })
    @Field((type) => Int, { nullable: true })
    public totalEmployees?: number;

    /**
     * Date of Creation of Entity
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    @Field((type) => Date, { nullable: true })
    public creationDate?: Date;

    /**
     * The link of Linkedin of Entity
     */
    @Column({
        nullable: true,
        length: 255,
    })
    @Field({ nullable: true })
    public linkedin?: string;

    /**
     * The link of Linkedin of Entity
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public colorGradiantLeft?: string;

    /**
     * The link of Linkedin of Entity
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public colorGradiantRight?: string;

    /**
     * The link of Linkedin of Entity
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public colorHeader?: string;

    /**
     * The link of Linkedin of Entity
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public colorSticker?: string;

    /**
     * Description of Entity
     */
    @Column({
        type: 'text',
        nullable: true,
    })
    @Field({ nullable: true })
    public description?: string;

    /**
     * Type of entity
     */
    @Column({
        type: 'enum',
        enum: EntityType,
        nullable: true,
    })
    @Field((type) => EntityType, { nullable: true })
    public type?: EntityType;

    /**
     * Membership number of Entity
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public membershipNumber?: string;

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
    @Field((type) => Date, { nullable: true })
    public createdAt?: Date;

    /**
     * Updated column
     */
    @UpdateDateColumn({
        // ...
    })
    @Field((type) => Date, { nullable: true })
    public updatedAt?: Date;

    /**
     * Deleted column
     */
    @DeleteDateColumn({
        //
    })
    @Field((type) => Date, { nullable: true })
    public deletedAt?: Date;

    /**
     * Creator column
     */
    @CreatedByColumn()
    @Field({ nullable: true })
    public createdBy?: string;

    /**
     * Editor column
     */
    @UpdatedByColumn()
    @Field({ nullable: true })
    public updatedBy?: string;

    /**
     * Check if column name is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(
            /^(label|colorGradiantLeft|colorGradiantRight|colorHeader|colorSticker|createdBy|updatedBy)$/i,
        );
    }

    /**
     * Return an instance of EntityEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): EntityEntity {
        return id ? new EntityEntity({ id: id }) : null;
    }
}
