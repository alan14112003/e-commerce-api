import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from 'src/app/products/entities/product.entity';

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  order: Order;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  productName: string;

  @Column()
  price: number;

  @Column({ type: 'varchar', length: 500 })
  image: string;

  @Column()
  quantity: number;
}
