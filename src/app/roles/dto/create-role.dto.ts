import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Quản trị viên', description: 'Tên của vai trò' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Vai trò có quyền quản trị hệ thống',
    description: 'Mô tả vai trò',
  })
  @IsString()
  @IsNotEmpty()
  descriptions: string;

  @ApiProperty({ example: 'admin', description: 'Mã duy nhất của vai trò' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Danh sách ID của permissions',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  permissionIds: number[];
}
