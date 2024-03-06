import { Book } from 'src/structure/books/entity/book.entity';
import { RentEvent } from 'src/structure/rent-event/entity/rent-event.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RentRegistry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Book, (book) => book.rentRegistry)
  book: Book;

  @OneToMany(() => RentEvent, (rent) => rent.rentRegistry)
  rentEvents: RentEvent[];
}
