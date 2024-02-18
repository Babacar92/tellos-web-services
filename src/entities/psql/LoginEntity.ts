import {
    AfterLoad,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';
import { CreatedByColumn } from '../../libs/databases/decorators/columns/CreatedByColumn';
import { CryptColumn } from '../../libs/databases/decorators/columns/CryptColumn';
import { PasswordColumn } from '../../libs/databases/decorators/columns/PasswordColumn';
import { UpdatedByColumn } from '../../libs/databases/decorators/columns/UpdatedByColumn';
import { TOKENS_TYPES } from '../../types/tokens.const';
import { TokenEntity } from './TokenEntity';
import { Employee } from './EmployeeEntity';
import { UserConnectedInterface } from '@Libs/auth/dto/interfaces/user.connected.interface';
import { UserLoginInterface } from '@Modules/login/dto/interfaces/user.login.interface';
import { NotificationLoginEntity } from './NotificationLoginEntity';
import { CustomerNoteEntity } from './CustomerNoteEntity';
import { CustomerDocumentEntity } from './CustomerDocumentEntity';
import { CustomerTimelineEntity } from './CustomerTimelineEntity';
import { LoginPermissionEntity } from './LoginPermissionEntity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

/**
 * The Login Entity
 */
@Entity({ name: 'login' })
@Unique(['email', 'deletedAt'])
@Unique(['username', 'deletedAt'])
@ObjectType()
export class LoginEntity implements UserConnectedInterface, UserLoginInterface {
    /**
     * The constructor of Login Entity
     * @param data
     */
    public constructor(data?: LoginEntity) {
        if (data) Object.assign(this, data);
    }

    /**
     * Id of Login
     */
    @PrimaryGeneratedColumn()
    @Field((type) => Int, { nullable: true })
    public id?: number;

    /**
     * The target Employee of Login
     */
    @OneToOne(() => Employee, (employee) => employee.login, {
        onDelete: 'CASCADE',
        nullable: true,
    })
    @Field((type) => Employee, { nullable: true })
    @JoinColumn()
    public employee?: Employee;

    @Column({ nullable: true })
    public employee_id?: number;

    /**
     * The permissions
     */
    @OneToMany(() => LoginPermissionEntity, (permission) => permission.login, {
        onDelete: 'CASCADE',
    })
    @Field((type) => LoginPermissionEntity, { nullable: true })
    public permissions?: LoginPermissionEntity[];

    /**
     * Notification of login
     */
    @OneToMany(
        () => NotificationLoginEntity,
        (notification) => notification.login,
        {
            onDelete: 'CASCADE',
        },
    )
    @Field((type) => NotificationLoginEntity, { nullable: true })
    public notifications?: NotificationLoginEntity[];

    /**
     * Notes of customer
     */
    @OneToMany(() => CustomerNoteEntity, (note) => note.login, {
        onDelete: 'SET NULL',
    })
    @Field((type) => CustomerNoteEntity, { nullable: true })
    public customerNotes?: CustomerNoteEntity[];

    /**
     * Documents of customer
     */
    @OneToMany(() => CustomerDocumentEntity, (doc) => doc.login, {
        onDelete: 'SET NULL',
    })
    @Field((type) => CustomerDocumentEntity, { nullable: true })
    public customerDocuments?: CustomerDocumentEntity[];

    /**
     * Documents of customer
     */
    @OneToMany(() => CustomerTimelineEntity, (time) => time.login, {
        onDelete: 'SET NULL',
    })
    @Field((type) => CustomerTimelineEntity, { nullable: true })
    public customerTimelines?: CustomerTimelineEntity[];

    /**
     * Firstname of target User of Login
     */
    @CryptColumn({
        nullable: true,
    })
    @Field((type) => String, { nullable: true })
    public firstname?: string;

    /**
     * Lastname of target User of Login
     */
    @CryptColumn({
        nullable: true,
    })
    @Field((type) => String, { nullable: true })
    public lastname?: string;

    /**
     * Email of target User of Login
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public email?: string;

    /**
     * Username of target User of Login
     */
    @CryptColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public username?: string;

    /**
     * Password of target User of Login
     */
    @PasswordColumn({
        nullable: true,
    })
    @Field({ nullable: true })
    public password?: string;

    /**
     * Is external user
     */
    @Column({
        type: 'boolean',
        default: false,
        nullable: true,
    })
    @Field({ nullable: true })
    public isExternal?: boolean;

    /**
     * Confirmation Login of User
     */
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    @Field({ nullable: true })
    public confirmedAt?: Date;

    /**
     * Last login of Login User
     */
    @Column({
        type: 'timestamp',
        nullable: true,
    })
    @Field({ nullable: true })
    public lastLogin?: Date;

    /**
     * Token of Login User
     */
    @ManyToMany(() => TokenEntity, {
        onDelete: 'CASCADE',
    })
    @JoinTable({
        name: 'login_token',
    })
    @Field((type) => TokenEntity, { nullable: true })
    public tokens?: TokenEntity[];

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
    @Field({ nullable: true })
    public createdAt?: Date;

    /**
     * Updated column
     */
    @UpdateDateColumn({
        // ...
    })
    @Field({ nullable: true })
    public updatedAt?: Date;

    /**
     * Deleted column
     */
    @DeleteDateColumn({
        //
    })
    @Field({ nullable: true })
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

    public findValidToken?(name: TOKENS_TYPES): TokenEntity {
        return this.tokens?.find((t) => t.name === name && t.isValid());
    }

    public getId?(): number {
        return this.id;
    }

    public getSub?(): number {
        return this.id;
    }

    public getEmail?(): string {
        return this.email;
    }

    public getUsername?(): string {
        return this.username;
    }

    public getPassword?(): string {
        return this.password;
    }

    @AfterLoad()
    public afterLoad?() {
        if (!this.isExternal && this.employee) {
            this.firstname = this.employee.firstname;
            this.lastname = this.employee.lastname;
            this.email = this.employee.emailPro || this.employee.emailPerso;
        }
    }

    /**
     * Check if is crypt column
     * @param name
     * @returns
     */
    public static isCryptColumn(name?: string): boolean {
        return !!name?.match(/^(emailPro|email|username)$/i);
    }

    /**
     * Check if is crypt column
     * @param name
     * @returns
     */
    public static isColumnString(name?: string): boolean {
        return !!name?.match(/^(createdBy|updatedBy)$/i);
    }

    /**
     * Return an instance of LoginEntity if id is a number
     * @param id
     * @returns
     */
    public static init(id?: number): LoginEntity {
        return id ? new LoginEntity({ id: id }) : null;
    }
}
