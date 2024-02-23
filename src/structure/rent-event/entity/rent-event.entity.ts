import { RentRegistry } from 'src/structure/rent-registry/entity/rent-registry.entity';
import { Renter } from 'src/structure/renters/entity/renter.entity';
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

  @Column()
  type: RentEventType;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Renter, (renter) => renter.rentEvents, { eager: true })
  renter: Renter;

  @ManyToOne(() => RentRegistry, (rent) => rent.rentEvents, { eager: true })
  rentRegistry: RentRegistry;
}
