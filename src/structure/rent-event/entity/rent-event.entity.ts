import { RentRegistry } from 'src/structure/rent-registry/entity/rent-registry.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

enum RentEventType {
  RENT = 'rent',
  RETURN = 'return',
}

@Entity()
export class RentEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: RentEventType })
  type: RentEventType;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.rentEvents, { eager: true })
  user: User;

  @ManyToOne(() => RentRegistry, (rent) => rent.rentEvents, { eager: true })
  rentRegistry: RentRegistry;
}
