import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  externalLink: string;

  @Column()
  description: string;

  @Column()
  uri: string;

  @Column()
  isSale: boolean;

  @Column()
  ownerId: number;

  @Column()
  categoryId: number;

  @Column('decimal', { nullable: true })
  price: number;

  @Column()
  address: string;

  @Column({ nullable: true })
  tokenId: number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.products)
  @JoinColumn({ name: 'ownerId' })
  user: User;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
