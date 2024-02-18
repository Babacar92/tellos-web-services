import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { UpdatedByColumn } from '../../libs/databases/decorators/columns/UpdatedByColumn';
import { CreatedByColumn } from '../../libs/databases/decorators/columns/CreatedByColumn';
import { LoginEntity } from './LoginEntity';
import { EntityEntity } from './EntityEntity';
import { PermissionEntity } from './PermissionEntity';

@Entity({ name: 'login_permission' })
export class LoginPermissionEntity {
  /**
   * The constructor of Login Entity
   * @param data
   */
  public constructor(data?: LoginPermissionEntity) {
    if (data) Object.assign(this, data);
  }

  /**
   * Id of Login
   */
  @PrimaryGeneratedColumn()
  public id?: number;

  /**
   * The login entity
   */
  @ManyToOne(() => LoginEntity, (login) => login.permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  public login?: LoginEntity;

  /**
   * The entity entity
   */
  @ManyToOne(() => EntityEntity, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  public entity?: EntityEntity;

  /**
   * The permission permission
   */
  @ManyToOne(() => PermissionEntity, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  public permission?: PermissionEntity;

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
  public static isColumnString(name?: string): boolean {
    return !!name?.match(/^(createdBy|updatedBy)$/i);
  }

  /**
   * Return an instance of LoginPermissionEntity if id is a number
   * @param id
   * @returns
   */
  public static init(id?: number): LoginPermissionEntity {
    return id ? new LoginPermissionEntity({ id: id }) : null;
  }
}
