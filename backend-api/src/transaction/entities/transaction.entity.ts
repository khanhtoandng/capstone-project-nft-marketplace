import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  contractAddress: string;

  @Column()
  transactionAddress: string;

  @Column('decimal', { nullable: true })
  totalPrice: Date;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  sellerAccount: string;

  @Column({ nullable: true })
  buyerAccount: string;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  type: string;
}
