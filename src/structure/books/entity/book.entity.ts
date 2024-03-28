import { RentEvent } from 'src/structure/rent-event/entity/rent-event.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string | null;

  @Column({ nullable: true })
  publicationLanguage?: string | null;

  @Column({ nullable: true })
  originalLanguage?: string | null;

  @Column({ nullable: true })
  numberOfPages?: number | null;

  @Column({ nullable: true })
  editionNumber?: number | null;

  @Column({ nullable: true })
  releaseDate?: Date | null;

  @Column({ nullable: true })
  publicationDate?: Date | null;

  @Column({ nullable: true })
  format?: string | null;

  @Column({ nullable: true })
  coverType?: string | null;

  @Column({ nullable: true })
  author?: string | null;

  @Column({ nullable: true })
  publisher?: string | null;

  @Column('numeric', { nullable: true, precision: 5, scale: 2 })
  price?: number | null;

  @Column({ nullable: true })
  height?: number | null;

  @Column({ nullable: true })
  width?: number | null;

  @Column({ nullable: true })
  depth?: number | null;

  @Column({ default: false })
  isActive: boolean;
  @Column({ unique: true, nullable: true })
  isbn?: string | null;

  @Column({ enum: ['return', 'rent'], nullable: true, default: null })
  status: 'return' | 'rent' | null;

  @OneToMany(() => RentEvent, (rentEvent) => rentEvent.book, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  rentEvents: RentEvent[];
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
