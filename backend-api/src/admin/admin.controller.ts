import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  async findAll() {
    return this.adminService.findAll();
  }

  @Post('login')
  async login(@Body() body: any) {
    return await this.adminService.login(body.email, body.password);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const user = await this.adminService.findOne(id);

    return user;
  }

  @Put('update/:id')
  async updateUser(@Param('id') id: number, @Body() body: any) {
    return await this.adminService.update(id, body);
  }
}
