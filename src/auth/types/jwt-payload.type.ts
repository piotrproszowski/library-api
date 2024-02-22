import { User } from '../../users/entities/user.entity';

export type JwtPayload = Pick<User, 'id' | 'email' | 'role'>;
