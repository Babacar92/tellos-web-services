/**
 * Default sort from database
 */
export class DatabaseSortArg {
  /**
   * List of columns and order
   */
  [column: string]: 'ASC' | 'DESC';
}
