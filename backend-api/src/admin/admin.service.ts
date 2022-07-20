import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async findAll(): Promise<Admin[]> {
    const items = await this.adminRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    return items;
  }

  findOne(id: number): Promise<Admin> {
    return this.adminRepository.findOne({ where: { id } });
  }

  async login(email: string, password: string) {
    const user = await this.adminRepository.findOne({
      where: { email, password },
    });

    if (!user) {
      return { success: false };
    }

    return {
      success: true,
      user: user,
      msg: 'You are now logged in.',
    };
  }

  async update(id: number, body: any) {
    await this.adminRepository.update(id, body);
    console.log('===', id);

    const updatedProduct = await this.adminRepository.findOne({
      where: { id },
    });

    if (updatedProduct) {
      return updatedProduct;
    }

    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }
}
