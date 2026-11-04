import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { InventoryLog } from './inventory-log.entity.js';
import { ProductVariant } from './product-variant.entity.js';
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

  @Column({ type: 'varchar', length: 100, default: 'Khác' })
  category: string;

  @OneToMany(() => InventoryLog, (log) => log.product)
  logs: Relation<InventoryLog[]>; // 👈 Đổi từ InventoryLog[] thành Relation<InventoryLog[]>

  @OneToMany(() => ProductVariant, (variant) => variant.product)
variants: Relation<ProductVariant[]>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
