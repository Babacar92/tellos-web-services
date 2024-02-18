// NestJs
import { Field, InputType, Int } from '@nestjs/graphql';

//Class Validator / Transform
import { IsString, Validate } from 'class-validator';
import { Transform } from 'class-transformer';

// Library

//Schemas
import { CategoryEquipment } from 'src/entities/psql/CategoryEquipmentEntity';
import { EntityEntity } from 'src/entities/psql/EntityEntity';

//Constraints
import { CategoryEquipmentExistConstraint } from 'src/modules/category-equipment/constraints/category-equipment.exist.constraint';
import { EntityExistConstraint } from 'src/modules/entity/constraints/entity.exist.constraint';
import { LoginEntity } from '@/entities/psql/LoginEntity';

@InputType()
export class CreateEquipmentParkInput {
    /**
     * Login of note
     */
    public login?: LoginEntity;

    @IsString()
    @Field()
    denomination: string;

    @Validate(EntityExistConstraint, {})
    @Transform(({ value }) => EntityEntity.init(value))
    @Field((type) => Int)
    entity: EntityEntity;

    @Validate(CategoryEquipmentExistConstraint, {})
    @Transform(({ value }) => CategoryEquipment.init(value))
    @Field((type) => Int)
    category: CategoryEquipment;
}
