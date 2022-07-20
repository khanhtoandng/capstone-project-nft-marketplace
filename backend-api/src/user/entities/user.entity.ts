import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  joinedDate: Date;

  @Column({ nullable: true })
  nonce: number;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];
}
