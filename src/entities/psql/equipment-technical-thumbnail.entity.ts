import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';

@ObjectType()
@Entity('equipment_technical_thumbnail')
export class EquipmentTechnicalThumbnail extends BaseEntity {

  constructor(data?: Partial<EquipmentTechnicalThumbnail>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id!: number;

  @Column({
    nullable: true,
  })
  @Field()
  value!: string;

  /**
   * Check if column name is string
   */
  public static isColumnString(value: string): boolean {
    return !!value.match(/^(createdBy|updatedBy)$/i);
  }

  /**
   * Return an instance of WorkUnitEntity if id is a number
   * @param id
   * @returns
   */
  public static init(id?: number): EquipmentTechnicalThumbnail {
    return id ? new EquipmentTechnicalThumbnail({ id: id }) : null;
  }
}
