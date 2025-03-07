import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty, IsInt } from 'class-validator';

export class UpdateRolePermissionsDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: 'Danh sách ID của permissions',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  permissionIds: number[];
}
