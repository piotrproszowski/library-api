import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { ConfirmationCodeType } from '../enums/confirmation-code-type.enum';

@Entity()
@Index(['code'], { unique: true })
export class ConfirmationCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  type: ConfirmationCodeType;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ default: false })
  wasUsed: boolean;

  @Column({ nullable: true, default: null })
  expiresAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
