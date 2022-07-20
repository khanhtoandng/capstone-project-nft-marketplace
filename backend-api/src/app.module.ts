import { Module } from '@nestjs/common';
import { DatabaseModule } from './modules/database.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { TransactionModule } from './transaction/transaction.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    UserModule,
    DatabaseModule,
    CategoryModule,
    ProductModule,
    TransactionModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
