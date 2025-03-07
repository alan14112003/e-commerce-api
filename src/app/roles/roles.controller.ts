import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoleResponseDto } from './dto/role-response.dto';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo vai trò mới' })
  @ApiOkResponse({
    description: 'Vai trò đã được tạo thành công',
    type: RoleResponseDto,
  })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả vai trò' })
  @ApiOkResponse({ description: 'Danh sách vai trò', type: [RoleResponseDto] })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin vai trò theo ID' })
  @ApiParam({ name: 'id', required: true, description: 'ID của vai trò' })
  @ApiOkResponse({ description: 'Thông tin vai trò', type: RoleResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy vai trò' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật vai trò' })
  @ApiParam({ name: 'id', required: true, description: 'ID của vai trò' })
  @ApiOkResponse({
    description: 'Vai trò đã được cập nhật',
  })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Patch(':id/permissions')
  @ApiOperation({ summary: 'Cập nhật quyền của vai trò' })
  @ApiParam({ name: 'id', required: true, description: 'ID của vai trò' })
  @ApiOkResponse({
    description: 'Quyền của vai trò đã được cập nhật',
  })
  updatePermissions(
    @Param('id') id: string,
    @Body() updateRolePermissionsDto: UpdateRolePermissionsDto,
  ) {
    return this.rolesService.updatePermissions(+id, updateRolePermissionsDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa vai trò' })
  @ApiParam({ name: 'id', required: true, description: 'ID của vai trò' })
  @ApiOkResponse({ description: 'Vai trò đã bị xóa' })
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
