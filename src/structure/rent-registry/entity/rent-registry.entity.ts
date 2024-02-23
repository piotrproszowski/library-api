import { Books } from 'src/structure/books/entity/books.entity';
import { RentEvent } from 'src/structure/rent-event/entity/rent-event.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RentRegistry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Books, (book) => book.rentRegistry)
  book: Books;

  @OneToMany(() => RentEvent, (rent) => rent.rentRegistry)
  rentEvents: RentEvent[];
}
