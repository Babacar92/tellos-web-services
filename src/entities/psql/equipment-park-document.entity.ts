//NestJs
import { Field, Int, ObjectType } from '@nestjs/graphql';

//TypeOrm
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { DocumentTypeEntity } from '@/entities/psql/DocumentTypeEntity';
import { LoginEntity } from './LoginEntity';
import { UploadEntity } from './UploadEntity';

@ObjectType()
@Entity('equipment_park_document')
export class EquipmentParkDocument extends BaseEntity {
    constructor(data?: Partial<EquipmentParkDocument>) {
        super();
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id!: number;

    @ManyToOne(() => EquipmentPark, (equipmentPark) => equipmentPark.id)
    @JoinColumn()
    @Field((type) => EquipmentPark)
    equipmentPark: EquipmentPark;

    @Column()
    equipment_park_id: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    title?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    description?: string;

    @ManyToOne(() => DocumentTypeEntity, (employee) => employee.id, {
        nullable: true,
    })
    @JoinColumn()
    @Field(() => DocumentTypeEntity, { nullable: true })
    type?: DocumentTypeEntity;

    @Column({ nullable: true })
    type_id?: number;

    @ManyToOne(() => LoginEntity, {
        nullable: true,
    })
    @JoinColumn()
    @Field((type) => LoginEntity, { nullable: true })
    user?: LoginEntity;

    @Column({ nullable: true })
    user_id?: number;

    @ManyToOne(() => UploadEntity, {
        onDelete: 'SET NULL',
        nullable: true,
    })
    @JoinColumn()
    @Field((type) => UploadEntity, { nullable: true})
    public file?: UploadEntity;

    @Column({ nullable: true })
    file_id?: number;
}
