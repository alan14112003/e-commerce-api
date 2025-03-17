import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { DataSource, FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { OrderStatusEnum } from './enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto & { user: User }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const order = this.orderRepository.create({
        user: createOrderDto.user,
        address: createOrderDto.user.address,
        email: createOrderDto.user.email,
        fullName: createOrderDto.user.fullName,
        phone: createOrderDto.user.phone,
        status: OrderStatusEnum.Pending,
      });

      const orderCreated = await queryRunner.manager.save(order);

      const products = await this.productRepository.find({
        where: {
          id: In(createOrderDto.products.map((item) => item.productId)),
        },
      });

      const orderItems = createOrderDto.products.map((item) => {
        const productExistIdx = products.findIndex(
          (product) => item.productId === product.id,
        );

        if (productExistIdx == -1) {
          throw new NotFoundException(
            `product id #${item.productId} not found`,
          );
        }

        const productExist = products[productExistIdx];

        if (productExist.quantity - item.quantity < 0) {
          throw new BadRequestException(
            `quantity for product id #${item.productId} not enough`,
          );
        }

        return {
          order: orderCreated,
          product: productExist,
          productName: productExist.product_name,
          price: productExist.price,
          image: productExist.image,
          quantity: item.quantity,
        };
      });

      for (const product of products) {
        const itemExist = createOrderDto.products.find(
          (item) => item.productId === product.id,
        )!;

        await queryRunner.manager.update(
          Product,
          { id: product.id },
          { quantity: product.quantity - itemExist.quantity },
        );
      }

      await queryRunner.manager.insert(OrderDetail, orderItems);

      await queryRunner.commitTransaction();

      return { message: 'Order created successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    // Tạo điều kiện tìm kiếm nếu có
    const where: FindOptionsWhere<Order> = search
      ? { email: Like(`%${search}%`) }
      : {};

    const [results, total] = await this.orderRepository.findAndCount({
      where: { ...where },
      skip,
      take: limit,
    });

    return {
      data: results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }
}
