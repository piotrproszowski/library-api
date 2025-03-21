import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRole } from '../enums/user-role.enum';

import { ConfirmationCode } from '../../auth/entities/confirmation-code.entity';
import { RoleHelper } from '../helpers/role.helper';
import { UserLogin } from './user-login.entity';
import { RentEvent } from 'src/structure/rent-event/entity/rent-event.entity';

@Entity()
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false, nullable: true })
  password?: string | null;

  @Column({ nullable: true })
  name?: string | null;

  @Column({ enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @OneToMany(() => ConfirmationCode, (code) => code.user, { lazy: true })
  confirmationCodes: Promise<ConfirmationCode[]>;

  @OneToMany(() => UserLogin, (login) => login.user, { lazy: true })
  logins: Promise<UserLogin[]>;

  @OneToMany(() => RentEvent, (rent) => rent.user, { lazy: true })
  rentEvents: Promise<RentEvent[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date | null;

  public hasAccessTo?(role: UserRole) {
    return RoleHelper.hasUserAccessTo(this, role);
  }
}
