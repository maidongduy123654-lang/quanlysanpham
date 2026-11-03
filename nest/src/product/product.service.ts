import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, LessThan } from 'typeorm';
import { Product } from './entities/product.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';

// 📝 [CẦN DB] Bỏ comment 2 import dưới SAU KHI tạo bảng
// import { InventoryLog } from './entities/inventory-log.entity.js';
// import { ProductVariant } from './entities/product-variant.entity.js';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    // 📝 [CẦN DB] Bỏ comment 2 dòng dưới SAU KHI tạo bảng
    // @InjectRepository(InventoryLog)
    // private readonly logRepository: Repository<InventoryLog>,
    // @InjectRepository(ProductVariant)
    // private readonly variantRepository: Repository<ProductVariant>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  // ✅ AN TOÀN: Tìm kiếm, lọc giá, lọc sắp hết, sắp xếp, phân trang
  async findAll(query?: any): Promise<any> {
    // Nếu không có query → trả về mảng (tương thích code cũ)
    if (!query || Object.keys(query).length === 0) {
      return await this.productRepository.find({ order: { createdAt: 'DESC' } });
    }

    const { search, minPrice, maxPrice, lowStock, sortBy, sortOrder, page = 1, limit = 5 } = query;

    const where: any = {};
    if (search) where.name = Like(`%${search}%`);
    if (minPrice && maxPrice) where.price = Between(Number(minPrice), Number(maxPrice));
    if (lowStock === 'true') where.stock = LessThan(20);

    // 📝 [CẦN DB] Bỏ comment dòng dưới SAU KHI có cột category
    // if (category) where.category = category;

    const order: any = {};
    if (sortBy) order[sortBy] = sortOrder === 'desc' ? 'DESC' : 'ASC';
    else order.createdAt = 'DESC';

    const skip = (Number(page) - 1) * Number(limit);

    const [data, total] = await this.productRepository.findAndCount({
      where,
      order,
      skip,
      take: Number(limit),
      // 📝 [CẦN DB] Bỏ comment dòng dưới SAU KHI có bảng product_variants
      // relations: ['variants'],
    });

    return {
      data,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      // 📝 [CẦN DB] Bỏ comment dòng dưới SAU KHI có bảng liên quan
      // relations: ['variants', 'logs'],
    });
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

  // ✅ AN TOÀN: Cập nhật kho nhanh (chỉ dùng cột stock có sẵn)
  async updateStock(id: number, amount: number): Promise<Product> {
    const product = await this.findOne(id);
    const newStock = product.stock + amount;
    if (newStock < 0) throw new Error('Số lượng kho không được âm');

    product.stock = newStock;
    await this.productRepository.save(product);

    // 📝 [CẦN DB] Bỏ comment phần log dưới SAU KHI có bảng inventory_logs
    // const log = this.logRepository.create({
    //   action: amount > 0 ? 'IMPORT' : 'EXPORT',
    //   quantity: Math.abs(amount),
    //   product,
    // });
    // await this.logRepository.save(log);

    return product;
  }

  // ✅ AN TOÀN: Thống kê Dashboard (tính từ bảng products có sẵn)
  async getStats(): Promise<{ totalProducts: number; lowStockCount: number; totalValue: number }> {
    const totalProducts = await this.productRepository.count();
    const lowStockCount = await this.productRepository.count({ where: { stock: LessThan(20) } });
    const totalValueResult = await this.productRepository
      .createQueryBuilder('product')
      .select('SUM(product.price * product.stock)', 'totalValue')
      .getRawOne();

    return {
      totalProducts,
      lowStockCount,
      totalValue: Number(totalValueResult?.totalValue) || 0,
    };
  }

  // ✅ AN TOÀN: Xóa hàng loạt
  async bulkDelete(ids: number[]): Promise<{ message: string }> {
    await this.productRepository.delete(ids);
    return { message: `Đã xóa ${ids.length} sản phẩm` };
  }

  // 📝 [CẦN DB] Lịch sử kho — Bỏ comment SAU KHI tạo bảng inventory_logs
  // async getInventoryLogs(productId: number): Promise<InventoryLog[]> {
  //   return this.logRepository.find({
  //     where: { product: { id: productId } },
  //     order: { createdAt: 'DESC' },
  //   });
  // }

  // 📝 [CẦN DB] Biến thể — Bỏ comment SAU KHI tạo bảng product_variants
  // async addVariant(productId: number, variantData: any): Promise<ProductVariant> {
  //   const product = await this.findOne(productId);
  //   const variant = this.variantRepository.create({ ...variantData, product });
  //   return this.variantRepository.save(variant);
  // }
  }
