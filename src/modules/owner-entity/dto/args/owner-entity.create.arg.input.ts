import { IsOptional, IsString, Validate } from 'class-validator';
import { OwnerEntityNotExistByColumnConstraint } from '../../constraints/owner-entity.not.exist.by.column.constraints';
import { Field } from '@nestjs/graphql';

/**
 * Input for to create a new owner entity
 */
export class OwnerEntityCreateArgInput {
  /**
   * The name of owner entity
   */
  @IsString()
  @Validate(OwnerEntityNotExistByColumnConstraint, {})
  public name: string;

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
