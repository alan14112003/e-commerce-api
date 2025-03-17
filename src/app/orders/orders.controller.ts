import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Permission } from '../auth/decorators/permission.decorator';
import { GetAllOrdersDto } from './dto/get-all-orders.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiTags('Orders')
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo giao dịch đặt hàng mới' })
  @ApiCreatedResponse({ description: 'Tạo thành công' })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    return this.ordersService.create({
      products: createOrderDto.products,
      user: req.user,
    });
  }

  @Get()
  @Permission('orders.all')
  @ApiOperation({ summary: 'Lấy danh sách đặt hàng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách đặt hàng',
  })
  @ApiForbiddenResponse({ description: 'Không có quyền truy cập' })
  async findAll(@Query() getAllUsersDto: GetAllOrdersDto) {
    return this.ordersService.findAll(
      getAllUsersDto.page,
      getAllUsersDto.limit,
      getAllUsersDto.search,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // }
}
