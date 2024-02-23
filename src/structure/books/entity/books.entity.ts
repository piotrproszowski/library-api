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
export class Books {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description?: string | null;

  @Column({ nullable: true })
  author?: string | null;

  @Column({ nullable: true })
  price?: number | null;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RentRegistry, (rent) => rent.book)
  rentRegistry: RentRegistry[];
}
