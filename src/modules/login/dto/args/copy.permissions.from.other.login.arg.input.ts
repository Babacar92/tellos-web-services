import { IsInt, IsOptional, Validate } from 'class-validator';
import { LoginExistConstraint } from '../../constraints/login.exist.constraint';
import { EntityExistConstraint } from '../../../entity/constraints/entity.exist.constraint';

export class CopyPermissionsFromOtherLoginArgInput {
  /**
   * The login where we get the permissions
   */
  @IsInt()
  @Validate(LoginExistConstraint, {})
  public fromLogin: number;

  /**
   * The login where we put the permissions
   */
  @IsInt()
  @Validate(LoginExistConstraint, {})
  public toLogin: number;

  /**
   * The target entity to output the current permission from it
   */
  @IsOptional()
  @IsInt()
  @Validate(EntityExistConstraint, {})
  public targetEntity?: number;
}
