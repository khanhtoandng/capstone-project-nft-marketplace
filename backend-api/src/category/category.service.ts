import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['products'] });
  }

  async create(body: any) {
    const newCategory = this.categoryRepository.create({
      name: body.name,
      banner: body.banner,
      description: body.description,
      icon: body.icon,
      createdAt: new Date(),
    });

    const data = await this.categoryRepository.save(newCategory);

    return data;
  }

  async update(id: number, body: any) {
    await this.categoryRepository.update(id, body);

    const updatedCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (updatedCategory) {
      return updatedCategory;
    }

    throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
  }

  async delete(id: number) {
    const mapProduct = await this.productRepository.findOne({
      where: {
        categoryId: id,
      },
    });

    if (mapProduct) {
      throw new HttpException('Category is used', HttpStatus.BAD_REQUEST);
    }

    const deleteResponse = await this.categoryRepository.delete(id);

    if (!deleteResponse.affected) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
  }
}
