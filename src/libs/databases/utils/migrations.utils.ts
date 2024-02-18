import { EntityManager } from 'typeorm';
import {
  PERMISSIONS_LIST,
  PERMISSIONS_TYPES,
} from '../../../types/permissions.const';
import {
  ROLES_LIST,
  ROLES_NAMES,
  ROLES_TYPES,
} from '../../../types/roles.const';
import { prepareQuery } from './db.utils';
import { EncryptionService } from '../services/encryption.service';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

const { PWD, DB_TABLE_PREFIX, PSQL_SCHEMA } = process.env;

/**
 * The permissions saved type
 */
export declare type SavedPermissionsType = {
  id: number;
  name: PERMISSIONS_TYPES;
}[];

/**
 * The roles saved type
 */
export declare type SavedRolesType = { id: number; name: ROLES_TYPES }[];

/**
 * Create default data for migration
 * @param manager
 */
export const migrationSaveDefaultData = async (
  manager: EntityManager,
  ignoreUser = false,
  migration?: string,
): Promise<void> => {
  // Add default permissions
  const permissions: SavedPermissionsType =
    await migrationSaveDefaultPermissions(manager, migration);

  // Add default roles
  const roles: SavedRolesType = await migrationSaveDefaultRoles(
    manager,
    permissions,
    migration,
  );

  // Add default user
  if (!ignoreUser) await migrationSaveDefaultUsers(manager, roles, migration);
};

/**
 * Save the default Permissions
 * Delete old Permissions if not in list
 * @param manager
 * @returns
 */
export const migrationSaveDefaultPermissions = async (
  manager: EntityManager,
  migration?: string,
): Promise<SavedPermissionsType> => {
  return new Promise(async (resolve, reject) => {
    // Set table name
    const permissionTablename = `${DB_TABLE_PREFIX}permission`;
    // Add default permissions
    const permissions: SavedPermissionsType = [];
    const data = await updateDataVersion(
      migration,
      'permissions',
      PERMISSIONS_LIST,
    );

    // Remove all not existing in list
    await prepareQuery(
      manager,
      `DELETE FROM ${permissionTablename} WHERE name::text NOT IN (:...data)`,
      {
        data: data.permissions.length ? data.permissions : ['__'],
      },
    );

    if (data.permissions.length) {
      for (const _pKey in data.permissions) {
        const permissionName = data.permissions[_pKey];

        // Check if exist
        const oldPermission = (
          await prepareQuery(
            manager,
            `SELECT id FROM ${permissionTablename} WHERE name::text IN (:name)`,
            {
              name: permissionName,
            },
          )
        )[0];

        if (!oldPermission) {
          // Insert new permission
          const [res] = await prepareQuery(
            manager,
            `INSERT INTO ${permissionTablename} (active, name) VALUES (:active, :name) RETURNING id`,
            {
              active: true,
              name: permissionName,
            },
          );

          // Add permission
          permissions.push({
            id: res.id,
            name: permissionName,
          });
        } else {
          // Add permission
          permissions.push({
            id: oldPermission.id,
            name: permissionName,
          });
        }
      }
    }

    resolve(permissions);
  });
};

/**
 * Save the default Roles
 * Delete old Roles if not in list
 * @param manager
 * @param permissions
 * @returns
 */
export const migrationSaveDefaultRoles = async (
  manager: EntityManager,
  permissions: SavedPermissionsType,
  migration?: string,
): Promise<SavedRolesType> => {
  return new Promise(async (resolve, reject) => {
    // Add default permissions
    // Set table name
    const roleTablename = `${DB_TABLE_PREFIX}role`;
    const roles: SavedRolesType = [];

    // Remove all not existing in list
    await prepareQuery(
      manager,
      `DELETE FROM ${roleTablename} WHERE name NOT IN (:...data)`,
      {
        data: ROLES_LIST,
      },
    );

    if (ROLES_LIST.length) {
      const rolePermissionTablename = `${DB_TABLE_PREFIX}role_permission`;

      // Remove all relation between roles and permissions
      await prepareQuery(manager, `DELETE FROM ${rolePermissionTablename}`);

      for (const _rKey in ROLES_LIST) {
        const roleName = ROLES_LIST[_rKey];

        // Check if exist
        const oldRole = (
          await prepareQuery(
            manager,
            `SELECT id FROM ${roleTablename} WHERE name IN (:name)`,
            {
              name: roleName,
            },
          )
        )[0];

        if (!oldRole) {
          // Insert new role
          const [res] = await prepareQuery(
            manager,
            `INSERT INTO ${roleTablename} (active, name) VALUES (:active, :name) RETURNING id`,
            {
              active: true,
              name: roleName,
            },
          );

          const oldRole = (
            await prepareQuery(
              manager,
              `SELECT id FROM ${roleTablename} WHERE name IN (:name)`,
              {
                name: roleName,
              },
            )
          )[0];

          // Set Role relation with permissions
          permissions
            // .filter(_perm => !!ROLES_AND_PERMISSIONS[roleName].find(p => p === _perm.name))
            .map((_perm) => _perm.id)
            .forEach(async (_permId) => {
              // Insert role and permission relation
              await prepareQuery(
                manager,
                `INSERT INTO ${rolePermissionTablename} (role_id, permission_id) VALUES (:role_id, :permission_id)`,
                {
                  role_id: res.id,
                  permission_id: _permId,
                },
              );
            });

          // Add role
          roles.push({
            id: res.id,
            name: roleName,
          });
        } else {
          // Set Role relation with permissions
          permissions
            // .filter(_perm => !!ROLES_AND_PERMISSIONS[roleName].find(p => p === _perm.name))
            .map((_perm) => _perm.id)
            .forEach(async (_permId) => {
              // Insert role and permission relation
              await prepareQuery(
                manager,
                `INSERT INTO ${rolePermissionTablename} (role_id, permission_id) VALUES (:role_id, :permission_id)`,
                {
                  role_id: oldRole.id,
                  permission_id: _permId,
                },
              );
            });

          // Add role
          roles.push({
            id: oldRole.id,
            name: roleName,
          });
        }
      }
    }

    resolve(roles);
  });
};

/**
 * Save the default Roles
 * Delete old Roles if not in list
 * @param manager
 * @param roles
 */
export const migrationSaveDefaultUsers = async (
  manager: EntityManager,
  roles: SavedRolesType,
  migration?: string,
): Promise<void> => {
  const {
    USER_DEV_EMAIL,
    USER_DEV_USERNAME,
    USER_DEV_PASSWORD,
    USER_OWNER_EMAIL,
    USER_OWNER_USERNAME,
    USER_OWNER_PASSWORD,
  } = process.env;

  if (USER_DEV_EMAIL && USER_DEV_USERNAME && USER_DEV_PASSWORD) {
    const email = await EncryptionService.encrypt(USER_DEV_EMAIL);
    // const username = await EncryptionService.encrypt(USER_DEV_USERNAME);
    const password = EncryptionService.hash(USER_DEV_PASSWORD);
    const roleIds = roles
      .filter((r) => r.name === ROLES_NAMES.SUPER_ADMIN)
      .map((r) => r.id);

    // Insert user user
    await migrationSaveOneUser(manager, email, password, roleIds);
  }

  if (USER_OWNER_EMAIL && USER_OWNER_USERNAME && USER_OWNER_PASSWORD) {
    const email = await EncryptionService.encrypt(USER_OWNER_EMAIL);
    // const username = await EncryptionService.encrypt(USER_OWNER_USERNAME);
    const password = EncryptionService.hash(USER_OWNER_PASSWORD);
    const roleIds = roles
      .filter((r) => r.name === ROLES_NAMES.SUPER_ADMIN)
      .map((r) => r.id);

    // Insert user user
    await migrationSaveOneUser(manager, email, password, roleIds);
  }
};

export const migrationSaveOneUser = async (
  manager: EntityManager,
  email: string,
  password: string,
  roleIds: number[],
): Promise<void> => {
  const userTablename = await getUserTable(manager);
  const loginTablename = `${DB_TABLE_PREFIX}login`;
  const columnRelation = userTablename.replace(DB_TABLE_PREFIX, '');
  const userRoleTablename = `${DB_TABLE_PREFIX}${columnRelation}_role`;
  const dateNow = new Date();

  // Insert user
  const [insertedUser] = await prepareQuery(
    manager,
    `INSERT INTO ${userTablename} (email_pro, active) VALUES (:email_pro, :active) RETURNING id`,
    {
      email_pro: email,
      active: true,
    },
  );

  // Insert login user
  const [insertedLogin] = await prepareQuery(
    manager,
    `INSERT INTO ${loginTablename} (${columnRelation}_id, email, active, password, confirmed_at) VALUES (:user_id, :email, :active, :password, :confirmed_at) RETURNING id`,
    {
      user_id: insertedUser.id,
      email: email,
      active: true,
      password: password,
      confirmed_at: dateNow,
    },
  );

  // Update user
  const updatedUser = await prepareQuery(
    manager,
    `UPDATE ${userTablename} SET login_id = :login_id WHERE email_pro = :email`,
    {
      login_id: insertedLogin.id,
      email: email,
    },
  );

  // Insert relation between user and Roles
  for (const iR in roleIds) {
    const roleId = roleIds[iR];

    const insertedUserRole = await prepareQuery(
      manager,
      `INSERT INTO ${userRoleTablename} (${columnRelation}_id, role_id) VALUES (:user_id, :role_id)`,
      {
        user_id: insertedUser.id,
        role_id: roleId,
      },
    );
  }
};

/**
 *
 * @param manager
 * @returns
 */
export const getUserTable = async (manager: EntityManager): Promise<string> => {
  const userTablename = `${DB_TABLE_PREFIX}user`;
  const [res] = await prepareQuery(
    manager,
    `SELECT EXISTS (SELECT table_name FROM information_schema.tables WHERE table_schema = :table_schema AND table_name = :table_name)`,
    {
      table_schema: PSQL_SCHEMA,
      table_name: userTablename,
    },
  );
  return res.exists ? userTablename : `${DB_TABLE_PREFIX}employee`;
};

/**
 * Set version of data
 * @param migration
 * @param key
 * @param data
 * @returns
 */
export const updateDataVersion = async (
  migration: string,
  key: string,
  data: any,
): Promise<any> => {
  // Get migration name
  const dataVersionsFilename = `${PWD}/_guard_data_versions.json`;
  let dataVersions: any;

  // Get data version if file exist or set default
  if (fs.existsSync(dataVersionsFilename))
    dataVersions = JSON.parse(
      fs.readFileSync(dataVersionsFilename, { encoding: 'utf-8' }),
    );
  else dataVersions = {};

  if (migration && key && data) {
    // Check if migration name doesn't exist
    if (!dataVersions[migration]) {
      dataVersions[migration] = {};

      // Set key of migration name if not exist
      dataVersions[migration][key] = data;

      // Update file
      fs.writeFileSync(dataVersionsFilename, JSON.stringify(dataVersions), {
        encoding: 'utf-8',
        mode: '0777',
      });
    }

    return dataVersions[migration];
  }

  return { [key]: data };
};
