import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(offset, limit): Promise<User[]> {
    const items = await this.usersRepository.find({
      order: {
        joinedDate: 'DESC',
      },
      skip: offset,
      take: limit,
    });

    return items;
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findOneByAddress(address: string) {
    const data = await this.usersRepository.findOne({ where: { address } });
    return data;
  }

  async checkExistedUser(address: string) {
    const user = await this.usersRepository.findOne({ where: { address } });

    if (user) {
      return true;
    }

    return false;
  }

  async login(address: string) {
    let user = await this.usersRepository.findOne({ where: { address } });

    if (!user) {
      const newUser = await this.usersRepository.create({
        address,
        avatar: 'https://uninft.s3.ap-southeast-1.amazonaws.com/20.png',
      });

      user = await this.usersRepository.save(newUser);
    }

    return {
      success: true,
      user: user,
      msg: 'You are now logged in.',
    };
  }

  async update(id: number, body: any) {
    await this.usersRepository.update(id, body);

    const updatedProduct = await this.usersRepository.findOne({
      where: { id },
    });

    if (updatedProduct) {
      return updatedProduct;
    }

    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async count() {
    return await this.usersRepository.count();
  }
}
