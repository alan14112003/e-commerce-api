import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { RoleResponseDto } from 'src/app/roles/dto/role-response.dto';
import { Role } from 'src/app/roles/entities/role.entity';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'ID của user' })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Nguyen Van A', description: 'Họ và tên' })
  @Expose()
  fullName: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng',
  })
  @Expose()
  email: string;

  @ApiProperty({
    example: '0123456789',
    description: 'số điện thoại của người dùng',
  })
  @Expose()
  phone: string;

  @ApiProperty({
    example: '123/ lê lợi',
    description: 'địa chỉ của người dùng',
  })
  @Expose()
  address: string;

  @ApiProperty({ example: 1, description: 'ID của vai trò (Role)' })
  @Expose()
  @Type(() => RoleResponseDto)
  role: Role;
}
