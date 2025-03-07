import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { RolesService } from '../roles/roles.service';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private rolesService: RolesService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }

  // Xác thực từ token
  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async register(registerDto: RegisterDto) {
    const role = await this.rolesService.findOneNotRelation(registerDto.roleId);
    if (!role) {
      throw new BadRequestException('Invalid role');
    }

    const user = await this.usersService.create({
      fullName: registerDto.fullName,
      email: registerDto.email,
      password: bcrypt.hashSync(registerDto.password, 10),
      role: role,
    });

    return user;
  }
}
