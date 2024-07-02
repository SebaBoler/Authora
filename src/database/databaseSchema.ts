import { activationCodeTable } from './schema/activateCode';
import { organizationsTable } from './schema/organizations';
import { pastPasswordTable } from './schema/pastPassword';
import { permissionsTable } from './schema/permissions';
import { rolesTable } from './schema/roles';
import { usersTable } from './schema/users';

export const databaseSchema = {
  usersTable,
  organizationsTable,
  rolesTable,
  permissionsTable,
  pastPasswordTable,
  activationCodeTable,
};
