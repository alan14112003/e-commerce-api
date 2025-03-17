import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const category = await this.categoryRepository.findOne({
        where: {
          id: createProductDto.categoryId,
        },
      });

      if (!category) {
        throw new BadRequestException(
          `category #${createProductDto.categoryId} not exist`,
        );
      }

      const product = this.productRepository.create({
        ...createProductDto,
        category: category,
      });

      return await this.productRepository.save(product);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('product slug already exists');
      }
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    // Tạo điều kiện tìm kiếm nếu có
    const where: FindOptionsWhere<Product> = search
      ? { product_name: Like(`%${search}%`) }
      : {};

    const [results, total] = await this.productRepository.findAndCount({
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

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`product #${id} not found`);
    }

    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    try {
      return this.productRepository.update(id, updateProductDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('product slug already exists');
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
