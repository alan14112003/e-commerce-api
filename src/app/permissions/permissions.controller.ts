import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { GetAllPermissionsDto } from './dto/get-all-permissions.dto';

@ApiTags('Permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo quyền mới' })
  @ApiOkResponse({
    description: 'Quyền đã được tạo thành công',
    type: PermissionResponseDto,
  })
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả quyền' })
  @ApiOkResponse({
    description: 'Danh sách quyền',
    type: [PermissionResponseDto],
  })
  findAll(@Query() getAllPermissionsDto: GetAllPermissionsDto) {
    return this.permissionsService.findAll(
      getAllPermissionsDto.page,
      getAllPermissionsDto.limit,
      getAllPermissionsDto.search,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin quyền theo ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID của quyền' })
  @ApiOkResponse({
    description: 'Thông tin quyền',
    type: PermissionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy quyền' })
  async findOne(@Param('id') id: string) {
    const permission = await this.permissionsService.findOne(+id);
    if (!permission) {
      throw new NotFoundException(`Permission #${id} not found`);
    }
    return permission;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật quyền' })
  @ApiParam({ name: 'id', required: true, description: 'ID của quyền' })
  @ApiOkResponse({
    description: 'Quyền đã được cập nhật',
  })
  update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa quyền' })
  @ApiParam({ name: 'id', required: true, description: 'ID của quyền' })
  @ApiOkResponse({ description: 'Quyền đã bị xóa' })
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }
}
