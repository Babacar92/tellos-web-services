import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { OwnerEntityNotExistByColumnConstraint } from '../../constraints/owner-entity.not.exist.by.column.constraints';
import { OwnerEntityExistConstraint } from '../../constraints/owner-entity.exist.constraint';
import { Field } from '@nestjs/graphql';

/**
 * Input for to update a new owner entity
 */
export class OwnerEntityUpdateArgInput {
  /**
   * The id of owner entity
   */
  @IsNotEmpty()
  @Validate(OwnerEntityExistConstraint, {})
  public id: number;


  /**
   * The title of owner entity
   */
  @IsOptional()
  @IsString()
  @Validate(OwnerEntityNotExistByColumnConstraint, {})
  @Field()
  public name?: string;

  @IsOptional()
  @IsString()
  @Field()
  public address?: string;

  @IsOptional()
  @IsString()
  @Field()
  public addressBis?: string;

  @IsOptional()
  @IsString()
  @Field()
  public postcode?: string;

  @IsOptional()
  @IsString()
  @Field()
  public city?: string;

  @IsOptional()
  @IsString()
  @Field()
  public country?: string;

  @IsOptional()
  @IsString()
  @Field()
  public phone?: string;

  @IsOptional()
  @IsString()
  @Field()
  public siret?: string;

  @IsOptional()
  @IsString()
  @Field()
  public ape?: string;

}
