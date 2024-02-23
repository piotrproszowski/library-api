import { RentEvent } from 'src/structure/rent-event/entity/rent-event.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Renter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @OneToMany(() => RentEvent, (rent) => rent.renter)
  rentEvents: RentEvent[];
}
