import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PaginationParams } from 'src/dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  async findAll(
    @Query() { offset, limit }: PaginationParams,
    @Query() { productId }: any,
  ) {
    return this.transactionService.findAll(offset, limit, productId);
  }

  @Post()
  async createCategory(@Body() body: any) {
    return await this.transactionService.create(body);
  }

  @Get('/count')
  async count() {
    return await this.transactionService.count();
  }

  @Get('/sum')
  async sum() {
    return await this.transactionService.sum();
  }

  @Get('/monthlyTransaction')
  async getMonthlyTransaction() {
    return await this.transactionService.getMonthlyTransaction();
  }
}
