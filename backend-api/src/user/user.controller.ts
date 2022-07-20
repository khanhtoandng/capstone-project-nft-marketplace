import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PaginationParams } from 'src/dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async findAll(@Query() { offset, limit }: PaginationParams) {
    return this.userService.findAll(offset, limit);
  }

  @Post(':address')
  async checkExistedUser(@Param('address') address: string) {
    return await this.userService.login(address);
  }

  @Get('/detail/:address')
  async findOne(@Param('address') address: string) {
    const user = await this.userService.findOneByAddress(address);

    return user;
  }

  @Get('/detailById/:id')
  async findOneById(@Param('id') id: number) {
    const user = await this.userService.findOne(id);

    return user;
  }

  @Put('update/:id')
  async updateUser(@Param('id') id: number, @Body() body: any) {
    return await this.userService.update(id, body);
  }

  @Get('/count')
  async count() {
    return await this.userService.count();
  }
}
