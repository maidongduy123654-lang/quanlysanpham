import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int', { default: 0 })
  stock: number;

  // 📝 [CẦN DB] Bỏ comment dòng dưới SAU KHI bạn chạy SQL:
  // ALTER TABLE products ADD COLUMN category VARCHAR(100) DEFAULT 'Khác';
  // @Column({ type: 'varchar', length: 100, default: 'Khác' })
  // category: string;

  // 📝 [CẦN DB] Bỏ comment SAU KHI tạo bảng inventory_logs
  // @OneToMany(() => InventoryLog, (log) => log.product)
  // logs: InventoryLog[];

  // 📝 [CẦN DB] Bỏ comment SAU KHI tạo bảng product_variants
  // @OneToMany(() => ProductVariant, (variant) => variant.product)
  // variants: ProductVariant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
