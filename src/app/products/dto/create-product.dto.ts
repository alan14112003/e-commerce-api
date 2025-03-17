import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 1, description: 'ID của danh mục sản phẩm' })
  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @ApiProperty({
    example: 'Laptop Gaming',
    description: 'Tên sản phẩm',
    maxLength: 500,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  product_name: string;

  @ApiProperty({ example: 15000000, description: 'Giá sản phẩm', default: 0 })
  @IsInt()
  price: number;

  @ApiProperty({ example: 10, description: 'Số lượng sản phẩm', default: 0 })
  @IsInt()
  quantity: number;

  @ApiProperty({
    example: 'Laptop cấu hình mạnh dành cho gaming',
    description: 'Mô tả sản phẩm',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'laptop-gaming',
    description: 'Slug của sản phẩm',
    maxLength: 500,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  slug: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Ảnh sản phẩm',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  image?: string;
}
