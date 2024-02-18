import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';

/**
 * Input for to filter a new Quick Access
 */
export class LoginFilterArgInput extends DatabaseFilterArg {
  /**
   * The username of login
   */
  @IsOptional()
  @IsString()
  public username?: string;

  /**
   * The firstname of login
   */
  @IsOptional()
  @IsString()
  public firstname?: string;

  /**
   * The lastname of login */
  @IsOptional()
  @IsString()
  public lastname?: string;

  /**
   * The emailPro of login
   */
  @IsOptional()
  @IsString()
  public emailPro?: string;

  /**
   * Not the ids
   */
  @IsOptional()
  @IsInt({
    each: true,
  })
  public notIds?: number[];

  /**
   * Get user with permissions
   */
  @IsOptional()
  @IsBoolean()
  public hasPermissions?: boolean;
}
