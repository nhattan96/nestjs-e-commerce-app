import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EOrderStatus } from '../enum/order.enum';
import { Product } from 'src/products/entities/product.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  quantity!: number;

  @Column({
    default: EOrderStatus.PENDING,
  })
  status: EOrderStatus;

  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice!: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;

  // Relationships

  @ManyToOne(() => Product, (product) => product.orders)
  product!: Product;
}
