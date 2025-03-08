import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from 'src/app/roles/entities/role.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'Nguyen Van A', description: 'Họ và tên' })
  @IsString()
  fullName: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email của người dùng',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'Mật khẩu',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 1, description: 'ID của vai trò (Role)' })
  @IsNotEmpty()
  role: Role;
}
