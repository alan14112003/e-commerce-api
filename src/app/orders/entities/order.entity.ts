import { User } from 'src/app/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatusEnum } from '../enums/order-status.enum';
import { OrderDetail } from './order-detail.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  address: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  fullName: string;

  @Column()
  status: OrderStatusEnum;

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.order)
  items: OrderDetail;
}
