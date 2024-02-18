import { IsInt, IsOptional, IsString, Min } from 'class-validator';

/**
 * Input for to filter a new Quick Access
 */
export class LoginColumnToDisplayBodInput {
  /**
   * The target column
   */
  @IsOptional()
  @IsString()
  public username_c?: string;

  /**
   * The target column
   */
  @IsOptional()
  @IsString()
  public firstname_c?: string;

  /**
   * The target column
   */
  @IsOptional()
  @IsString()
  public lastname_c?: string;

  /**
   * The target column
   */
  @IsOptional()
  @IsString()
  public emailPro_c?: string;

  // For Logs

  /**
   * The target column
   */
  @IsOptional()
  @IsString()
  public createdAt_c?: string;

  /**
   * The target column
   */
  @IsOptional()
  @IsString()
  public user_c?: string;

  /**
   * The target column
   */
  @IsOptional()
  @IsString()
  public page_c?: string;

  /**
   * The target column
   */
  @IsOptional()
  @IsString()
  public action_c?: string;
}
