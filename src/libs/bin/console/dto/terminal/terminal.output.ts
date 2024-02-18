import * as chalk from 'chalk';
import * as Table from 'cli-table3';
import { COMMAND_TABLE_CHARS_BORDER_MODEL_NAME } from '../enum/command.table.chars.model.name.enum';

export const TABLE_CELL_TEXT_MAX_LENGTH = 80;

export type TableOptions = {
  borderModel?: COMMAND_TABLE_CHARS_BORDER_MODEL_NAME;
  stringLineLength?: number;
  style?: {
    'padding-left'?: number;
    'padding-right'?: number;
    head?: string[];
    border?: string[];
  };
};

/**
 * The output terminal
 */
export class Output {
  /**
   * Chars model
   */
  private readonly charsBorderModel = {
    [COMMAND_TABLE_CHARS_BORDER_MODEL_NAME.BORDER_HIDDEN]: {
      top: '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      bottom: '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      left: '',
      'left-mid': '',
      mid: '',
      'mid-mid': '',
      right: '',
      'right-mid': '',
      middle: ' ',
    },
    [COMMAND_TABLE_CHARS_BORDER_MODEL_NAME.BORDER_SIMPLE]: {
      mid: '',
      'left-mid': '',
      'mid-mid': '',
      'right-mid': '',
    },
    [COMMAND_TABLE_CHARS_BORDER_MODEL_NAME.BORDER_DOUBBLE]: {
      top: '═',
      'top-mid': '╤',
      'top-left': '╔',
      'top-right': '╗',
      bottom: '═',
      'bottom-mid': '╧',
      'bottom-left': '╚',
      'bottom-right': '╝',
      left: '║',
      'left-mid': '╟',
      mid: '─',
      'mid-mid': '┼',
      right: '║',
      'right-mid': '╢',
      middle: '│',
    },
  };

  /**
   * Generates a table and displays it
   * @param rows
   * @param headers
   */
  public table(
    rows: any[][],
    headers?: string[],
    options?: TableOptions,
  ): void {
    console.log(this.generatedTable(rows, headers, options).toString());
  }

  /**
   * Write line in terminal
   * @param message
   * @param params
   */
  public write(message: string, params?: any): void {
    console.log(this.replaceParams(message, params));
  }

  /**
   * Write line and add space
   * @param message
   * @param params
   * @param countLine
   */
  public writeLine(message: string, params?: any, countLine = 1): void {
    this.write(message, params);
    this._addBreakLine(countLine);
  }

  /**
   * Output a warning
   * @param message
   * @param params
   * @param countLine
   */
  public warning(message: string, params?: any, countLine = 1): void {
    console.log(
      chalk.yellow(`[WARNING]: ${this.replaceParams(message, params)}`),
    );
    this._addBreakLine(countLine);
  }

  /**
   * Output a error
   * @param message
   * @param params
   * @param countLine
   */
  public error(message: string, params?: any, countLine = 1): void {
    console.log(chalk.red(`[ERROR]: ${this.replaceParams(message, params)}`));
    this._addBreakLine(countLine);
  }

  /**
   * Output a success
   * @param message
   * @param params
   * @param countLine
   */
  public success(message: string, params?: any, countLine = 1): void {
    console.log(
      chalk.green(`[SUCCESS]: ${this.replaceParams(message, params)}`),
    );
    this._addBreakLine(countLine);
  }

  /**
   * Output a info
   * @param message
   * @param params
   * @param countLine
   */
  public info(message: string, params?: any, countLine = 1): void {
    console.log(chalk.blue(`[INFO]: ${this.replaceParams(message, params)}`));
    this._addBreakLine(countLine);
  }

  /**
   * Set color at the target message
   * @param message
   * @param color
   * @returns
   */
  public color(
    message: string,
    color: 'info' | 'success' | 'warning' | 'error' | 'white' = 'white',
    params?: any,
  ): string {
    switch (color) {
      case 'info':
        return chalk.blue(this.replaceParams(message, params));
      case 'success':
        return chalk.green(this.replaceParams(message, params));
      case 'warning':
        return chalk.yellow(this.replaceParams(message, params));
      case 'white':
        return chalk.white(this.replaceParams(message, params));
      case 'error':
        return chalk.red(this.replaceParams(message, params));
      default:
        return this.replaceParams(message, params);
    }
  }

  /**
   * Replace params to message
   * @param message
   * @param params
   * @returns
   */
  public replaceParams(message?: string, params?: any): string | undefined {
    if (params && message) {
      for (const name in params) {
        const value = params[name];

        message = message.replace(new RegExp(`{${name}}`, 'gi'), value);
      }
    }
    return message;
  }

  /**
   * Return instance of table
   * @param rows
   * @param headers
   * @param options
   * @param stringLineLength
   * @returns
   */
  public generatedTable(
    rows: string[][],
    headers?: string[],
    options?: TableOptions,
  ): any {
    const tableConfig: Table.TableConstructorOptions = {
      chars:
        this.charsBorderModel[
          typeof options?.borderModel === 'number'
            ? options.borderModel
            : COMMAND_TABLE_CHARS_BORDER_MODEL_NAME.BORDER_DOUBBLE
        ],
      style: Object.assign(
        {
          'padding-left': 1,
          'padding-right': 1,
          head: ['yellow'],
          border: ['grey'],
          compact: false,
        },
        options?.style || {},
      ),
    };

    if (headers) tableConfig.head = headers;

    const stringLineLength =
      options?.stringLineLength || TABLE_CELL_TEXT_MAX_LENGTH;

    const instance = new Table(tableConfig);

    instance.push(
      ...rows.map((r) =>
        r.map((v) => {
          if (v?.length > stringLineLength) {
            const splitted = v.split(' ');
            let value = '',
              line = '';

            for (const i in splitted) {
              const splitValue = splitted[i];

              if (line.length + splitValue.length >= stringLineLength) {
                value += '\n';
                line = '';
              } else {
                if (value) value += ' ';
                if (line) line += ' ';
              }

              value += splitValue;
              line += splitValue;
            }

            return value;
          }
          return v || '';
        }),
      ),
    );

    return instance;
  }

  /**
   * Add break line
   * @param count
   */
  private _addBreakLine(count: number): void {
    if (count > 1) {
      for (let i = 1; i < count; i++) {
        console.log('');
      }
    }
  }
}
