import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PermissionResponseDto {
  @ApiProperty({ example: 1, description: 'ID của quyền' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'CREATE_USER', description: 'Mã quyền' })
  @Expose()
  code: string;

  @ApiProperty({
    example: 'Cho phép tạo người dùng',
    description: 'Tên quyền',
  })
  @Expose()
  name: string;
}
