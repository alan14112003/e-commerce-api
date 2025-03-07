import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Role } from 'src/app/roles/entities/role.entity';

export class CreateUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  role: Role;
}
