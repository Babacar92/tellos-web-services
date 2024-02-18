import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

@ObjectType()
@Entity('equipment_technical_genre')
export class EquipmentTechnicalGenre extends BaseEntity {

  constructor(data?: Partial<EquipmentTechnicalGenre>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id!: number;

  @Column()
  @Field()
  name!: string;

  /**
   * Check if column name is string
   */
  public static isColumnString(value: string): boolean {
    return !!value.match(/^(name|createdBy|updatedBy)$/i);
  }

  /**
   * Return an instance of WorkUnitEntity if id is a number
   * @param id
   * @returns
   */
  public static init(id?: number): EquipmentTechnicalGenre {
    return id ? new EquipmentTechnicalGenre({ id: id }) : null;
  }
}
