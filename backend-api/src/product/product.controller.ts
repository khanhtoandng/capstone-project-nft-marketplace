import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PaginationParams } from 'src/dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async findAll(
    @Query() { offset, limit }: PaginationParams,
    @Query('categoryId') categoryId: any,
    @Query('ownerId') ownerId: any,
    @Query('search') search: any,
  ) {
    return this.productService.findAll(
      offset,
      limit,
      categoryId,
      ownerId,
      search,
    );
  }

  @Get('/detail/:id')
  async findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Get('topExpensive')
  async getTopExpensive() {
    return await this.productService.findTop3Expensive();
  }

  @Post('delete/:id')
  async deleteCategory(@Param('id') id: number) {
    return await this.productService.delete(id);
  }

  @Post()
  async createCategory(@Body() body: any) {
    return await this.productService.create(body);
  }

  @Put('update/:id')
  async updateCategory(@Param('id') id: number, @Body() body: any) {
    return await this.productService.update(id, body);
  }

  @Get('/count')
  async count() {
    return await this.productService.count();
  }
}
