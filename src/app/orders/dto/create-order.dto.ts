import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

class OrderItems {
  @ApiProperty({
    example: 1,
    description: 'The id of product',
  })
  @IsNotEmpty()
  productId: number;

  @ApiProperty({
    example: 1,
    description: 'The quantity of order',
  })
  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'The list of id product',
    example: [
      {
        productId: 1,
        quantity: 2,
      },
    ],
  })
  @IsNotEmpty()
  @IsArray()
  products: OrderItems[];
}
