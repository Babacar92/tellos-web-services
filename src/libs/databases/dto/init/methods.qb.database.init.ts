import { Brackets, ObjectLiteral } from 'typeorm';
import {
  EncryptionSearchMatchType,
  EncryptionService,
} from '../../services/encryption.service';
import { DatabaseSortArg } from '../args/database.sort.arg';
import { gen } from '../../../../utils/utils';

export const encryptionWhereCrypt = (
  qb: any,
  where:
    | string
    | Brackets
    | ((qb: any) => string)
    | ObjectLiteral
    | ObjectLiteral[],
  parameters?: ObjectLiteral,
  searchMatch?: EncryptionSearchMatchType,
): any => {
  const { newWhere, newParameters } = getParametersAndConditionWhere(
    where,
    parameters,
    searchMatch,
  );
  if (newWhere && newParameters) return qb.andWhere(newWhere, newParameters);
  return qb.andWhere(where, notEmptyParameters(parameters));
};

export const encryptionAndWhereCrypt = (
  qb: any,
  where:
    | string
    | Brackets
    | ((qb: any) => string)
    | ObjectLiteral
    | ObjectLiteral[],
  parameters?: ObjectLiteral,
  searchMatch?: EncryptionSearchMatchType,
): any => {
  const { newWhere, newParameters } = getParametersAndConditionWhere(
    where,
    parameters,
    searchMatch,
  );
  if (newWhere && newParameters) return qb.andWhere(newWhere, newParameters);
  return qb.andWhere(where, notEmptyParameters(parameters));
};

export const encryptionOrWhereCrypt = (
  qb: any,
  where:
    | string
    | Brackets
    | ((qb: any) => string)
    | ObjectLiteral
    | ObjectLiteral[],
  parameters?: ObjectLiteral,
  searchMatch?: EncryptionSearchMatchType,
): any => {
  const { newWhere, newParameters } = getParametersAndConditionWhere(
    where,
    parameters,
    searchMatch,
  );
  if (newWhere && newParameters) return qb.orWhere(newWhere, newParameters);
  return qb.orWhere(where, notEmptyParameters(parameters));
};

export const getParametersAndConditionWhere = (
  where:
    | string
    | Brackets
    | ((qb: any) => string)
    | ObjectLiteral
    | ObjectLiteral[],
  parameters?: ObjectLiteral,
  searchMatch?: EncryptionSearchMatchType,
): { newWhere?: string; newParameters?: ObjectLiteral } => {
  const validateParams = findEncryption(parameters, searchMatch);
  if (typeof where === 'string') {
    // Set RegExp
    const regexp = new RegExp(' or[ ]?| and[ ]?', 'gi');

    // Split condition
    const whereSplit = where
      .split(regexp)
      .map((v) => v.replace(/^\(|\)$/, '').trim());

    const returnedParams: any = {};

    for (const column in validateParams) {
      const values = validateParams[column];

      if (values instanceof Array) {
        // Get where part of column name
        const whereParts = whereSplit.filter(
          (v) => v.indexOf(`:${column}`) > -1,
        );

        // Set replace object
        const replaces: any = {};

        // Set replace values
        for (const i in values) {
          const newColumn = `${i}${column}`;
          const value = values[i];

          for (const i2 in whereParts) {
            const wherePart = whereParts[i2];

            // Init list replace
            if (!replaces[wherePart]) replaces[wherePart] = [];

            // Prepare replace
            replaces[wherePart].push(
              wherePart.replace(
                new RegExp(`\:${column}`, 'g'),
                `:${newColumn}`,
              ),
            );

            // Add parameter
            returnedParams[newColumn] = value;
          }
        }

        // Replace values
        for (const wherePart2 in replaces) {
          const value = replaces[wherePart2];

          where = where.replace(wherePart2, `(${value.join(' OR ')})`);
        }

        if (!where.match(/^\(/)) where = `(${where}`;
        else if (!where.match(/\)$/)) where += ')';
      } else {
        const newKey = gen(8, true, true, false, false);
        where = where.replace(new RegExp(`\:${column}`, 'g'), `:${newKey}`);
        delete returnedParams[column];
        returnedParams[newKey] = values;
      }
    }

    if (Object.keys(returnedParams).length) {
      return {
        newWhere: where,
        newParameters: returnedParams,
      };
    }
  }

  return {};
};

export const sortResult = (
  qb: any,
  sort: DatabaseSortArg,
  cb?: (columnName: string) => string | undefined,
): any => {
  if (sort && Object.keys(sort).length) {
    const sortKeys = Object.keys(sort);

    for (const i in sortKeys) {
      const sortKey = sortKeys[i];
      const oldValue = sort[sortKey];
      if (oldValue && oldValue.toString().match(/^(asc|desc)$/i)) {
        const newSortKey = cb ? cb(sortKey) : null;

        if (newSortKey) {
          delete sort[sortKey];
          sort[newSortKey] = oldValue;
        } else if (cb) delete sort[sortKey];
      } else {
        delete sort[sortKey];
      }
    }

    return qb.orderBy(sort);
  }
  return qb;
};

const findEncryption = (
  parameters?: ObjectLiteral,
  searchMatch?: EncryptionSearchMatchType,
): ObjectLiteral => {
  const validateParams: any = {};

  for (const i in parameters) {
    const param = parameters[i];

    if (typeof param === 'string') {
      validateParams[i] = EncryptionService.search(param, searchMatch);
    } else if (param instanceof Array) {
      validateParams[i] = [];

      for (const i in param) {
        const value = param[i];

        if (typeof value === 'string') {
          validateParams[i].push(
            ...EncryptionService.search(value, searchMatch),
          );
        }
      }
    }

    if (validateParams[i]) {
      // Remove if is empty
      if (!validateParams[i].length) delete validateParams[i];
      // Array to string if has only one value
      else if (validateParams[i].length < 2)
        validateParams[i] = validateParams[i][0].hash;
      // Object item to string value
      else validateParams[i] = validateParams[i].map((v: any) => v.hash);
    }
  }

  return validateParams;
};

export const notEmptyParameters = (paramters?: ObjectLiteral) => {
  if (paramters) {
    for (const i in paramters) {
      const value = paramters[i];

      if (value === undefined || value === null) delete paramters[i];
    }

    if (Object.keys(paramters).length) return paramters;
  }
};
