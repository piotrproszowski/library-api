import { Book } from 'src/structure/books/entity/book.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum RentEventType {
  RENT = 'rent',
  RETURN = 'return',
}

@Entity()
export class RentEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ enum: RentEventType })
  type: RentEventType;

  @Column({
    type: 'timestamptz',
  })
  date: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.rentEvents)
  user: User;

  @ManyToOne(() => Book, (book) => book.rentEvents)
  book: Book;
}
