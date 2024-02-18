import { CreatedByColumn } from 'src/libs/databases/decorators/columns/CreatedByColumn';
import { CryptColumn } from 'src/libs/databases/decorators/columns/CryptColumn';
import { UpdatedByColumn } from 'src/libs/databases/decorators/columns/UpdatedByColumn';
import { EmployeeDiplomaEnum } from 'src/modules/employee/dto/enums/employee.diploma.enum';
import { EmployeeStatusEnum } from 'src/modules/employee/dto/enums/employee.family.status.enum';
import { EmployeeSexEnum } from 'src/modules/employee/dto/enums/employee.sexe.enum';
import { EmployeeTitleEnum } from 'src/modules/employee/dto/enums/employee.title.enum';
import { getAge } from 'src/utils/utils';
import {
    AfterLoad,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { DepartmentEntity } from './DepartmentEntity';
import { EntityEntity } from './EntityEntity';
import { LoginEntity } from './LoginEntity';
import { QualificationEntity } from './QualificationEntity';
import { QuickAccessEntity } from './QuickAccessEntity';
import { RoleEntity } from './RoleEnitty';
import { UploadEntity } from './UploadEntity';
import { CareerPathEntity } from './CareerPathEntity';
import { EmployeeDocumentEntity } from './EmployeeDocumentEntity';
import { LeaveEntity } from './LeaveEntity';
import { MedicalVisitEntity } from './MedicalVisitEntity';
import { EmployeeTypeEnum } from '../../modules/employee/dto/enums/employee.type.enum';
import { EmployeeDisciplinaryEntity } from './EmployeeDisciplinaryEntity';
import { ContractInfoEntity } from './ContractInfoEntity';
import { ContractEntity } from './ContractEntity';
import { LeavePeriodEntity } from './LeavePeriodEntity';
import { AdministrativeMaterialEntity } from './AdministrativeMaterialEntity';
import { EquipmentDocumentEntity } from './EquipmentDocumentEntity';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EquipmentPark } from './equipment-park.entity';
import { EquipmentAdministrative } from './equipment-adminstrative.entity';

@ObjectType()
@Entity({ name: 'employee' })
@Unique(['number', 'deletedAt'])
@Unique(['emailPro', 'deletedAt'])
@Unique(['phonePro', 'deletedAt'])
@Unique(['phoneFixPro', 'deletedAt'])
@Unique(['emailPerso', 'deletedAt'])
@Unique(['phonePerso', 'deletedAt'])
@Unique(['phoneFixPerso', 'deletedAt'])
@Unique(['phoneShortcut', 'deletedAt'])
@Unique(['internalNumber', 'deletedAt'])
@Unique(['secureNumber', 'deletedAt'])
@Unique(['residencePermit', 'deletedAt'])
@Unique(['rib', 'deletedAt'])
export class Employee {
    /**
     * The constructor of Entity Entity
     * @param data
     */
    public constructor(data?: Employee) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Employee
     */
    @PrimaryGeneratedColumn()
    @Field((type) => Int, { nullable: true })
    public id?: number;

    /**
     * The role of User
     */
    @ManyToMany(() => RoleEntity, {
        onDelete: 'CASCADE',
    })
    @JoinTable({
        name: 'employee_role',
    })
    @Field((type) => [RoleEntity], { nullable: true })
    public roles?: RoleEntity[];

    @ManyToOne(
        () => EquipmentAdministrative,
        (equipmentAdminstrative) => equipmentAdminstrative.id,
        { nullable: true },
    )
    equipmentAdminisrative?: EquipmentAdministrative;

    /**
     * Login of Employee
     */
    @OneToOne(() => LoginEntity, (login) => login.employee, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @JoinColumn()
    @Field((type) => LoginEntity, { nullable: true })
    public login?: LoginEntity;

    /**
     * Entity of Employee
     */
    @ManyToOne(() => EntityEntity, (entity) => entity.employees, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    @Field((type) => EntityEntity, { nullable: true })
    public entity?: EntityEntity;

    @Column({ nullable: true })
    entity_id?: number;

    /**
     * Company Departure of Employee
     */
    @ManyToOne(() => EntityEntity, (entity) => entity.employees, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    @Field((type) => EntityEntity, { nullable: true })
    public companyDeparture?: EntityEntity;

    /**
     * Picture of Employee
     */
    @ManyToOne(() => UploadEntity, null, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    @Field((type) => UploadEntity, { nullable: true })
    public picture?: UploadEntity;

    /**
     * Department of Employee
     */
    @ManyToOne(() => DepartmentEntity, (department) => department.employees, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    @Field((type) => DepartmentEntity, { nullable: true })
    public department?: DepartmentEntity;

    /**
     * The quick access
     */
    @OneToMany(
        () => QuickAccessEntity,
        (quickAccess) => quickAccess.employee,
        {},
    )
    @Field((type) => [QuickAccessEntity], { nullable: true })
    public quickAccess?: QuickAccessEntity[];

    /**
     * The contracts
     */
    @OneToMany(() => ContractEntity, (contract) => contract.employee, {
        onDelete: 'SET NULL',
    })
    @Field((type) => [ContractEntity], { nullable: true })
    public contracts?: ContractEntity[];

    /**
     * The quick access
     */
    @OneToMany(
        () => EmployeeDocumentEntity,
        (document) => document.employee,
        {},
    )
    @Field((type) => [EmployeeDocumentEntity], { nullable: true })
    public documents?: EmployeeDocumentEntity[];

    /**
     * List of qualifications
     */
    @OneToMany(
        () => QualificationEntity,
        (qualification) => qualification.employee,
        {},
    )
    @Field((type) => [QualificationEntity], { nullable: true })
    public qualifications?: QualificationEntity[];

    /**
     * The superior of Employee
     */
    @ManyToOne(() => Employee, (employee) => employee.collaborators, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    @Field((type) => Employee, { nullable: true })
    public superior?: Employee;

    /**
     * The collaborators  of enmployee
     */
    @OneToMany(() => Employee, (employee) => employee.superior, {})
    @Field((type) => [Employee], { nullable: true })
    public collaborators?: Employee[];

    /**
     * The boss of Employee
     */
    @ManyToOne(() => Employee, (employee) => employee.employees, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    @Field((type) => Employee, { nullable: true })
    public boss?: Employee;

    /**
     * The collaborators  of enmployee
     */
    @OneToMany(() => Employee, (employee) => employee.boss, {})
    @Field((type) => [Employee], { nullable: true })
    public employees?: Employee[];

    /**
     * The carrers path of employee
     */
    @OneToMany(() => CareerPathEntity, (carrer) => carrer.employee, {})
    @Field((type) => [CareerPathEntity], { nullable: true })
    public careers?: CareerPathEntity[];

    /**
     * The Leaves granted
     */
    @OneToMany(() => LeaveEntity, (leave) => leave.employee, {})
    @Field((type) => [LeaveEntity], { nullable: true })
    public leaves?: LeaveEntity[];

    /**
     * employee contracts
     */
    @OneToOne(
        () => ContractInfoEntity,
        (contractInfo) => contractInfo.employee,
        {
            onDelete: 'CASCADE',
            nullable: true,
        },
    )
    @JoinColumn()
    @Field((type) => ContractInfoEntity, { nullable: true })
    public contractInfo?: ContractInfoEntity;

    /**
     * The medical Visits
     */
    @OneToMany(
        () => MedicalVisitEntity,
        (medicalVisit) => medicalVisit.employee,
        {},
    )
    @Field((type) => [MedicalVisitEntity], { nullable: true })
    public medicalVisits?: MedicalVisitEntity[];

    /**
     * list of equipment
     */
    @OneToMany(
        () => EquipmentPark,
        (equipmentPark) => equipmentPark.employee,
        {},
    )
    @Field((type) => [EquipmentPark], { nullable: true })
    public materialParks?: EquipmentPark[];

    /**
     * list of equipment document
     */
    @OneToMany(
        () => EquipmentDocumentEntity,
        (materialPark) => materialPark.employee,
        {},
    )
    @Field((type) => [EquipmentDocumentEntity], { nullable: true })
    public equipmentDocument?: EquipmentDocumentEntity[];

    /**
     * The list of leave periods
     */
    @OneToMany(
        () => LeavePeriodEntity,
        (leaveperiod) => leaveperiod.employee,
        {},
    )
    @Field((type) => [LeavePeriodEntity], { nullable: true })
    public leaveperiods?: LeavePeriodEntity[];

    /**
     * The disciplinarys of employee
     */
    @OneToMany(
        () => EmployeeDisciplinaryEntity,
        (employeeDisciplinarys) => employeeDisciplinarys.employee,
        {},
    )
    @Field((type) => [EmployeeDisciplinaryEntity], { nullable: true })
    public employeeDisciplinarys?: EmployeeDisciplinaryEntity[];

    /**
     * admin material of employee
     */
    @ManyToOne(
        () => AdministrativeMaterialEntity,
        (adminMat) => adminMat.customerNames,
        {
            onDelete: 'SET NULL',
            nullable: true,
        },
    )
    @JoinColumn()
    @Field((type) => AdministrativeMaterialEntity, { nullable: true })
    public adminMaterialCustomer?: AdministrativeMaterialEntity;

    /**
     * admin material of Persons to notify
     */
    @ManyToOne(
        () => AdministrativeMaterialEntity,
        (adminMat) => adminMat.personsToNotify,
        {
            onDelete: 'SET NULL',
            nullable: true,
        },
    )
    @JoinColumn()
    @Field((type) => AdministrativeMaterialEntity, { nullable: true })
    public adminMaterialPersonToNotify?: AdministrativeMaterialEntity;

    /**
     * Number of Employee
     */
    @Column({
        nullable: true,
    })
    @Field((type) => Int, { nullable: true })
    public number?: string;

    /**
     * Type of employee
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: EmployeeTypeEnum,
    })
    @Field((type) => EmployeeTypeEnum, { nullable: true })
    public type?: EmployeeTypeEnum;

    /**
     * Diplome of Employee
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: EmployeeDiplomaEnum,
    })
    @Field((type) => EmployeeDiplomaEnum, { nullable: true })
    public diplome?: EmployeeDiplomaEnum;

    /**
     * Gender of Employee
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: EmployeeSexEnum,
    })
    @Field((type) => EmployeeSexEnum, { nullable: true })
    public gender?: EmployeeSexEnum;

    /**
     * Number of children of Employee
     */
    @Column({
        type: 'int',
        unsigned: true,
        nullable: true,
    })
    @Field((type) => Int, { nullable: true })
    public numberOfChildren?: number;

    /**
     * The nationality of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public nationality?: string;

    /**
     * The bank of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public bank?: string;

    /**
     * The position of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public position?: string;

    /**
     * The rib of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public rib?: string;

    /**
     * The familyStatus of Employee
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: EmployeeStatusEnum,
    })
    @Field((type) => EmployeeStatusEnum, { nullable: true })
    public familyStatus?: EmployeeStatusEnum;

    /**
     * The countryBirth of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public countryBirth?: string;

    /**
     * The title of Employee
     */
    @Column({
        nullable: true,
        type: 'enum',
        enum: EmployeeTitleEnum,
    })
    @Field((type) => EmployeeTitleEnum, { nullable: true })
    public title?: EmployeeTitleEnum;

    /**
     * The secureNumber of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public secureNumber?: string;

    /**
     * The residencePermit of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public residencePermit?: string;

    /**
     * The rpDeliveryBy of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public rpDeliveryBy?: string;

    /**
     * The rpExpirationDate of Employee
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    @Field((type) => Date, { nullable: true })
    public rpExpirationDate?: Date;

    /**
     * Email pro of Employee
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public emailPro?: string;

    /**
     * Phone pro of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public phonePro?: string;

    /**
     * Phone fix pro of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public phoneFixPro?: string;

    /**
     * Email perso of Employee
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public emailPerso?: string;

    /**
     * Phone perso of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public phonePerso?: string;

    /**
     * Phone fix perso of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public phoneFixPerso?: string;

    /**
     * Phone shortcut of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public phoneShortcut?: string;

    /**
     * Internal number of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public internalNumber?: string;

    /**
     * Number of Employee
     */
    @Column({
        type: 'boolean',
        default: false,
    })
    @Field({ nullable: true })
    public handicap?: boolean;

    /**
     * Lastname of Employee
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public lastname?: string;

    /**
     * Lastname bis of Employee
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public lastnameBis?: string;

    /**
     * Firstname of Employee
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public firstname?: string;

    /**
     * Birthday of Employee
     */
    @Column({
        type: 'date',
        nullable: true,
    })
    @Field((type) => Date, { nullable: true })
    public birthday?: Date;

    /**
     * City of birth of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public cityBirth?: string;

    /**
     * Address of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public address?: string;

    /**
     * Postcode of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public postcode?: string;

    /**
     * City of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public city?: string;

    /**
     * Country of Employee
     */
    @Column({
        nullable: true,
    })
    @Field({ nullable: true })
    public country?: string;

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
     * Age of Employee
     */
    public age?: number;

    /**
     * Set values after load
     */
    @AfterLoad()
    public afterLoad?(): void {
        if (this.birthday) {
            this.age = getAge(this.birthday);
        }
    }

    /**
     * Check if column name is string
     */
    public static isColumnString(value: string): boolean {
        return !!value.match(
            /^(number|nationality|bank|position|rib|countryBirth|secureNumber|residencePermit|rpDeliveryBy|phonePro|phoneFixPro|phonePerso|phoneFixPerso|phoneShortcut|internalNumber|cityBirth|address|postcode|city|country|createdBy|updatedBy)$/i,
        );
    }

    /**
     * Check if is crypt column
     * @param name
     * @returns
     */
    public static isCryptColumn(name?: string): boolean {
        return !!name?.match(
            /^(username|emailPro|emailPerso|lastname|lastnameBis|firstname)$/i,
        );
    }

    /**
     * Return an instance of EmployeeEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): Employee {
        return id ? new Employee({ id: id }) : null;
    }
}
