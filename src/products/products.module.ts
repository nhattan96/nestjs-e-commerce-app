import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ProductsController],
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductsService],
})
export class ProductsModule {}
