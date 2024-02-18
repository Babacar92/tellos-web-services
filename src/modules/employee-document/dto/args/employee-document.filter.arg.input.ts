import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';

/**
 * Input for to filter a new Quick Access
 */
export class EmployeeDocumentFilterArgInput extends DatabaseFilterArg {
  /**
   * The employee id
   */
  @IsOptional()
  @IsInt()
  public employeeId?: number;

  /**
   * Require signatur or not
   */
  @IsOptional()
  @IsBoolean()
  public requireSignature?: boolean;

  /**
   * The status
   */
  @IsOptional()
  @IsString()
  public status?: string;

  /**
   * The statuses
   */
  @IsOptional()
  @IsString({
    each: true,
  })
  public statuses?: string[];

  /**
   * The type
   */
  @IsOptional()
  @IsInt()
  public type?: number;

  /**
   * The types
   */
  @IsOptional()
  @IsInt({
    each: true,
  })
  public types?: number[];
}
