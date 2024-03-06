import { RentRegistry } from 'src/structure/rent-registry/entity/rent-registry.entity';
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
  author?: string | null;

  @Column({ nullable: true })
  price?: string | null;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RentRegistry, (rent) => rent.book)
  rentRegistry: RentRegistry[];
}
