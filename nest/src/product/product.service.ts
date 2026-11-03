// src/products/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, LessThan } from 'typeorm';
import { Product } from './entities/product.entity.js';
import { InventoryLog } from './entities/inventory-log.entity.js';
import { ProductVariant } from './entities/product-variant.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(InventoryLog)
    private readonly logRepository: Repository<InventoryLog>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  // --- TÍNH NĂNG 5,6,7,8,9,16: Tìm kiếm, Lọc, Sắp xếp, Phân trang ---
  async findAll(query: any): Promise<{ data: Product[]; total: number; page: number; totalPages: number }> {
    const { search, category, minPrice, maxPrice, lowStock, sortBy, sortOrder, page = 1, limit = 5 } = query;

    const where: any = {};
    if (search) where.name = Like(`%${search}%`);
    if (category) where.category = category;
    if (minPrice && maxPrice) where.price = Between(Number(minPrice), Number(maxPrice));
    if (lowStock === 'true') where.stock = LessThan(20);

    const order: any = {};
    if (sortBy) order[sortBy] = sortOrder === 'desc' ? 'DESC' : 'ASC';
    else order.createdAt = 'DESC';

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await this.productRepository.findAndCount({
      where,
      order,
      skip,
      take: Number(limit),
      relations: ['variants'],
    });

    return {
      data,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id }, relations: ['variants', 'logs'] });
    if (!product) throw new NotFoundException(`Không tìm thấy sản phẩm ID ${id}`);
    return product;
  }

  async update(id: number, updateProductDto: Partial<CreateProductDto>): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  // --- TÍNH NĂNG 11 & 13: Cập nhật kho + Ghi lịch sử ---
  async updateStock(id: number, amount: number): Promise<Product> {
    const product = await this.findOne(id);
    const newStock = product.stock + amount;
    if (newStock < 0) throw new Error('Số lượng kho không được âm');

    product.stock = newStock;
    await this.productRepository.save(product);

    const log = this.logRepository.create({
      action: amount > 0 ? 'IMPORT' : 'EXPORT',
      quantity: Math.abs(amount),
      product,
    });
    await this.logRepository.save(log);

    return product;
  }

  // --- TÍNH NĂNG 13: Lấy lịch sử kho ---
  async getInventoryLogs(productId: number): Promise<InventoryLog[]> {
    return this.logRepository.find({
      where: { product: { id: productId } },
      order: { createdAt: 'DESC' },
    });
  }

  // --- TÍNH NĂNG 14: Thêm biến thể ---
  async addVariant(productId: number, variantData: any): Promise<ProductVariant> {
    const product = await this.findOne(productId);
    const variant = this.variantRepository.create({ ...variantData, product });
    return this.variantRepository.save(variant);
  }

  // --- TÍNH NĂNG 15: Thống kê Dashboard ---
  async getStats() {
    const totalProducts = await this.productRepository.count();
    const lowStockCount = await this.productRepository.count({ where: { stock: LessThan(20) } });
    const totalValueResult = await this.productRepository
      .createQueryBuilder('product')
      .select('SUM(product.price * product.stock)', 'totalValue')
      .getRawOne();

    return {
      totalProducts,
      lowStockCount,
      totalValue: Number(totalValueResult.totalValue) || 0,
    };
  }

  // --- TÍNH NĂNG 17: Xóa hàng loạt ---
  async bulkDelete(ids: number[]): Promise<{ message: string }> {
    await this.productRepository.delete(ids);
    return { message: `Đã xóa ${ids.length} sản phẩm` };
  }
}
