import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permission } from '../auth/decorators/permission.decorator';

@Controller('products')
@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Permission('products.create')
  @ApiOperation({ summary: 'Tạo sản phẩm mới' })
  @ApiResponse({ status: 201, description: 'Sản phẩm đã được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Permission('products.all')
  @ApiOperation({ summary: 'Lấy danh sách tất cả sản phẩm' })
  @ApiResponse({ status: 200, description: 'Danh sách sản phẩm' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @Permission('products.get')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết của một sản phẩm' })
  @ApiParam({ name: 'id', example: 1, description: 'ID của sản phẩm' })
  @ApiResponse({ status: 200, description: 'Thông tin chi tiết sản phẩm' })
  @ApiResponse({ status: 404, description: 'Sản phẩm không tồn tại' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @Permission('products.update')
  @ApiOperation({ summary: 'Cập nhật thông tin sản phẩm' })
  @ApiParam({ name: 'id', example: 1, description: 'ID của sản phẩm' })
  @ApiResponse({ status: 200, description: 'Sản phẩm đã được cập nhật' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 404, description: 'Sản phẩm không tồn tại' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Permission('products.delete')
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  @ApiParam({ name: 'id', example: 1, description: 'ID của sản phẩm' })
  @ApiResponse({ status: 200, description: 'Sản phẩm đã được xóa' })
  @ApiResponse({ status: 404, description: 'Sản phẩm không tồn tại' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
