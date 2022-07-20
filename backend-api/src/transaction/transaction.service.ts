import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async findAll(
    offset?: number,
    limit?: number,
    productId?: number,
  ): Promise<Transaction[]> {
    const where: any = {};

    if (productId) {
      where.productId = Equal(productId);
    }

    const items = await this.transactionRepository.find({
      where,
      order: {
        createdAt: 'DESC',
      },
      skip: offset,
      take: limit,
    });

    return items;
  }

  async create(body: any) {
    const newProduct = this.transactionRepository.create({
      productId: body.productId,
      contractAddress: body.contractAddress,
      transactionAddress: body.trx,
      totalPrice: body.totalPrice,
      description: body.description,
      sellerAccount: body.sellerAccount,
      buyerAccount: body.buyerAccount,
      type: body.type,
      createdAt: new Date(),
    });

    return await this.transactionRepository.save(newProduct);
  }

  async update(id: number, body: any) {
    await this.transactionRepository.update(id, body);

    const updatedProduct = await this.transactionRepository.findOne({
      where: { id },
    });
    if (updatedProduct) {
      return updatedProduct;
    }

    throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
  }

  async delete(id: number) {
    const deleteResponse = await this.transactionRepository.delete(id);

    if (!deleteResponse.affected) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }
  }

  async count() {
    return await this.transactionRepository.count();
  }

  async sum() {
    const data = await this.transactionRepository
      .createQueryBuilder()
      .select('SUM("totalPrice")', 'sum')
      .getRawOne();
    return data.sum;
  }

  async getMonthlyTransaction() {
    return this.transactionRepository
      .query(` select to_char(DATE_TRUNC('month', "createdAt"),'Mon') as "month", COUNT(id) AS count FROM product GROUP BY DATE_TRUNC('month', "createdAt");
    `);
  }
}
