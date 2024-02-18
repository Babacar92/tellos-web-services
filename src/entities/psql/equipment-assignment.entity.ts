import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { EquipmentPark } from './equipment-park.entity';
import { Employee } from './EmployeeEntity';
import { BaseEntity } from 'src/common/entities/base.entity';

@ObjectType()
@Entity('equipment_assignment')
export class EquipmentAssignment extends BaseEntity {
    constructor(data?: Partial<EquipmentAssignment>) {
        super();
        if (data) Object.assign(this, data);
    }

    @Field((type) => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => EquipmentPark, (equipmentPark) => equipmentPark.id)
    @JoinColumn({ name: 'equipment_park_id' })
    @Field((type) => EquipmentPark)
    equipementPark!: EquipmentPark;

    @Column()
    equipment_park_id: number;

    @ManyToOne(() => Employee, (employee) => employee.id)
    @JoinColumn({ name: 'employee_id' })
    @Field((type) => Employee)
    employee!: Employee;

    @Column()
    employee_id: number;

    @Column({ type: 'date' })
    @Field((type) => Date)
    startDate!: Date;

    @Column({ type: 'date', nullable: true })
    @Field((type) => Date, { nullable: true })
    endDate?: Date;

    static init(id?: number): EquipmentAssignment {
        return id ? new EquipmentAssignment({ id }) : null;
    }
}
