// NestJs
import { Field, Float, InputType, Int } from '@nestjs/graphql';

//Class Validator / Transform
import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';

//Schemas

//Constraints
import { EquipmentParkExistConstraint } from '../../equipment-park/equipment-park.exist.constraint';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { SheetTypeEnum } from '../../enums/sheet-type.enum';
import { CritAirEnum } from '../../enums/critair.enum';
import { GraphqlFilesUploadMultipleValidate } from '@/libs/upload/decorators/validators/GraphqlFilesUploadMultipleValidate';
import { UploadEntity } from '@/entities/psql/UploadEntity';
import { GraphqlFileUploadValidate } from '@/libs/upload/decorators/validators/GraphqlFileUploadValidate';
import { LoginEntity } from '@/entities/psql/LoginEntity';
import { LoginExistConstraint } from '@/modules/login/constraints/login.exist.constraint';

@InputType()
export class CreateEquipmentParkSheetInput {
    @Field((type) => Int)
    @Validate(EquipmentParkExistConstraint, {})
    @Transform(({ value }) => EquipmentPark.init(value))
    equipmentPark!: EquipmentPark;

    @Field((type) => SheetTypeEnum)
    @IsEnum(SheetTypeEnum)
    type!: SheetTypeEnum;

    @Field()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    returnDate!: Date;

    @Field((type) => Int, { nullable: true })
    @IsOptional()
    @Validate(LoginExistConstraint, {})
    @Transform(({ value }) => LoginEntity.init(value))
    controller?: LoginEntity;

    @Field((type) => Float, { nullable: true })
    @IsOptional()
    @IsNumber()
    counter?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    fuelLevel?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    generalState?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    interiorCleanliness?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    exteriorCleanliness?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    observation?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    thumnailCritAir?: boolean;

    @Field((type) => CritAirEnum, { nullable: true })
    @IsOptional()
    @IsEnum(CritAirEnum)
    thumnailCritAirNumber?: CritAirEnum;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    insurance?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    failureCard?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    totalCard?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    badge?: boolean;

    //
    @IsOptional()
    @GraphqlFilesUploadMultipleValidate({
        extension: ['pdf', 'png', 'docx', 'doc', 'jpeg', 'jpg'],
    })
    photos?: UploadEntity[];

    @IsOptional()
    @GraphqlFileUploadValidate({
        extension: ['pdf', 'png', 'docx', 'doc', 'jpeg', 'jpg'],
    })
    userSignature?: UploadEntity;

    @IsOptional()
    @GraphqlFileUploadValidate({
        extension: ['pdf', 'png', 'docx', 'doc', 'jpeg', 'jpg'],
    })
    controllerSignature?: UploadEntity;
}
