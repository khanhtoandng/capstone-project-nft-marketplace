import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, ILike, Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(
    offset?: number,
    limit?: number,
    categoryId?: any,
    ownerId?: any,
    search?: any,
  ): Promise<Product[]> {
    const where: any = {};
    if (categoryId) {
      where.categoryId = Equal(categoryId);
    }

    if (ownerId) {
      where.ownerId = Equal(ownerId);
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }
    const items = await this.productRepository.find({
      where,
      relations: ['user', 'category'],
      order: {
        createdAt: 'DESC',
      },
      skip: offset,
      take: limit,
    });

    return items;
  }

  async findOne(id: any): Promise<Product> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
    });
  }

  async findTop3Expensive(): Promise<Product[]> {
    const items = await this.productRepository.find({
      relations: ['user', 'category'],
      order: {
        price: 'DESC',
      },
      take: 3,
    });
    return items;
  }

  async create(body: any) {
    const newProduct = this.productRepository.create({
      name: body.name,
      externalLink: body.externalLink,
      description: body.description,
      uri: body.uri,
      isSale: body.isSale,
      ownerId: body.ownerId,
      categoryId: body.categoryId,
      price: body.price,
      address: body.address,
      createdAt: new Date(),
      tokenId: body.tokenId,
    });

    return await this.productRepository.save(newProduct);
  }

  async update(id: number, body: any) {
    await this.productRepository.update(id, body);

    const updatedProduct = await this.productRepository.findOne({
      where: { id },
    });
    if (updatedProduct) {
      return updatedProduct;
    }

    throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
  }

  async delete(id: number) {
    const deleteResponse = await this.productRepository.delete(id);

    if (!deleteResponse.affected) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
  }

  async count() {
    return await this.productRepository.count();
  }
}
