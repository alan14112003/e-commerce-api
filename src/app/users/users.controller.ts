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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permission } from '../auth/decorators/permission.decorator';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from '../auth/dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('users')
@UseGuards(JwtAuthGuard, PermissionGuard)
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Permission('users.create')
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  @ApiCreatedResponse({ description: 'Tạo thành công', type: UserResponseDto })
  @ApiBadRequestResponse({ description: 'Dữ liệu không hợp lệ' })
  @ApiForbiddenResponse({ description: 'Không có quyền thực hiện' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Permission('users.all')
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Danh sách người dùng',
    type: [UserResponseDto],
  })
  @ApiForbiddenResponse({ description: 'Không có quyền truy cập' })
  async findAll() {
    const users = this.usersService.findAll();
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @Permission('users.get')
  @ApiOperation({ summary: 'Lấy thông tin một người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin thành công',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng' })
  @ApiForbiddenResponse({ description: 'Không có quyền truy cập' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @Permission('users.update')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thành công',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng' })
  @ApiBadRequestResponse({ description: 'Dữ liệu cập nhật không hợp lệ' })
  @ApiForbiddenResponse({ description: 'Không có quyền chỉnh sửa' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Permission('users.delete')
  @ApiOperation({ summary: 'Xóa người dùng' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiNotFoundResponse({ description: 'Không tìm thấy người dùng' })
  @ApiForbiddenResponse({ description: 'Không có quyền xóa' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
