import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  banner: string;

  @Column()
  description: string;

  @Column()
  icon: string;

  @Column()
  createdAt: Date;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
