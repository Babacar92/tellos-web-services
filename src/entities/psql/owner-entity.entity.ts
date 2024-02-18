import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity('owner_entity')
export class OwnerEntity extends BaseEntity {
    constructor(data?: Partial<OwnerEntity>) {
        super();
        if (data) Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id!: number;

    @Column()
    @Field()
    name: string;

    @Column({nullable: true})
    @Field(() => String, {nullable: true})
    public address?: string;
  
    @Column({nullable: true})
    @Field(() => String, {nullable: true})
    public addressBis?: string;
  
    @Column({nullable: true})
    @Field(() => String, {nullable: true})
    public postcode?: string;
  
    @Column({nullable: true})
    @Field(() => String, {nullable: true})
    public city?: string;
  
    @Column({nullable: true})
    @Field(() => String, {nullable: true})
    public country?: string;
  
    @Column({nullable: true})
    @Field(() => String, {nullable: true})
    public phone?: string;
  
    @Column({nullable: true})
    @Field(() => String, {nullable: true})
    public siret?: string;
  
    @Column({nullable: true})
    @Field(() => String, {nullable: true})
    public ape?: string;

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
    public static init(id?: number): OwnerEntity {
        return id ? new OwnerEntity({ id: id }) : null;
    }
}
