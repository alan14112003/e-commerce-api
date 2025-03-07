import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PermissionResponseDto } from 'src/app/permissions/dto/permission-response.dto';

export class RoleResponseDto {
  @ApiProperty({ example: 1, description: 'ID của vai trò' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Admin', description: 'Tên vai trò' })
  @Expose()
  name: string;

  @ApiProperty({
    example: 'Quản trị viên hệ thống',
    description: 'Mô tả vai trò',
  })
  @Expose()
  descriptions: string;

  @ApiProperty({ example: 'ADMIN', description: 'Mã vai trò' })
  @Expose()
  code: string;

  @ApiProperty({
    type: [PermissionResponseDto],
    description: 'Danh sách quyền của vai trò',
  })
  @Expose()
  @Type(() => PermissionResponseDto)
  permissions: PermissionResponseDto[];
}
