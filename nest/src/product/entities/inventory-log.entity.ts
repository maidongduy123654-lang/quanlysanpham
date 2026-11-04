import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity.js';

@Entity('inventory_logs')
export class InventoryLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['IMPORT', 'EXPORT'] })
  action: 'IMPORT' | 'EXPORT';

  @Column('int')
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Product, (product) => product.logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;
}