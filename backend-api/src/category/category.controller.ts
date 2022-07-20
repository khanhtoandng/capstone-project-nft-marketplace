import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async findAll() {
    return this.categoryService.findAll();
  }

  @Post('delete/:id')
  async deleteCategory(@Param('id') id: number) {
    const data = await this.categoryService.delete(id);

    return { success: true };
  }

  @Post()
  async createCategory(@Body() body: any) {
    return await this.categoryService.create(body);
  }

  @Put('update/:id')
  async updateCategory(@Param('id') id: number, @Body() body: any) {
    return await this.categoryService.update(id, body);
  }
}
