import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import e from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.usersRepository.save(createUserDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already in use');
      }
    }
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: {
        id,
      },
      relations: {
        role: {
          permissions: true,
        },
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.usersRepository.update(id, updateUserDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already in use');
      }
    }
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: {
        role: {
          permissions: true,
        },
      },
    });
  }
}
