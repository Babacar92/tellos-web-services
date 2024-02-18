import { IsInt, IsOptional } from 'class-validator';

/**
 * The filter for filter permissions for form
 */
export class LoginPermissionsFormFilterArgInput {
  /**
   * The login ID
   */
  @IsOptional()
  @IsInt()
  public loginId?: number;

  /**
   * The entity ID
   */
  @IsOptional()
  @IsInt()
  public entityId?: number;
}
