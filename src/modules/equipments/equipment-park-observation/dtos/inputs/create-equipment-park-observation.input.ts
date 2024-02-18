// NestJs
import { Field, InputType, Int } from '@nestjs/graphql';

//Class Validator / Transform
import { IsDate, IsOptional, IsString, Validate } from 'class-validator';
import { Transform } from 'class-transformer';

//Schemas

//Constraints
import { EquipmentParkExistConstraint } from '../../../equipment-park/equipment-park.exist.constraint';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { LoginEntity } from '@/entities/psql/LoginEntity';

@InputType()
export class CreateEquipmentParkObservationInput {
    /**
     * Login of note
     */
    public login?: LoginEntity;

    @Field((type) => Int)
    @Validate(EquipmentParkExistConstraint, {})
    @Transform(({ value }) => EquipmentPark.init(value))
    equipmentPark!: EquipmentPark;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    observation?: string;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    @Field((type) => Int, { nullable: true })
    date?: Date;
}
