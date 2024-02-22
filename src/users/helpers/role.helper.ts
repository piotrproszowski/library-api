import { User } from '../entities/user.entity';
import { UserRole } from '../enums/user-role.enum';

export class RoleHelper {
  static hasUserAccessTo(
    user: Pick<User, 'role'> & { [key: string]: any },
    role: UserRole,
  ) {
    const roles = Object.values(UserRole);
    return roles.indexOf(user.role) <= roles.indexOf(role);
  }
}
