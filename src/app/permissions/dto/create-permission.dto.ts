import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ example: 'manage_users', description: 'Tên quyền' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Quyền quản lý người dùng',
    description: 'Mô tả quyền',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
