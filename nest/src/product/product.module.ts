import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service.js';
import { ProductController } from './product.controller.js';
import { Product } from './entities/product.entity.js';
import { User } from '../users/entities/user.entity.js';
import { InventoryLog } from './entities/inventory-log.entity.js';
import { ProductVariant } from './entities/product-variant.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      User,
      InventoryLog,
      ProductVariant,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
