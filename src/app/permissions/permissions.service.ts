import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, In, Like, Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    try {
      return await this.permissionRepository.save(createPermissionDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Permission code already exists');
      }
      throw error;
    }
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    // Tạo điều kiện tìm kiếm nếu có
    const where: FindOptionsWhere<Permission> = search
      ? { name: Like(`%${search}%`) }
      : {};

    const [results, total] = await this.permissionRepository.findAndCount({
      where: { ...where },
      skip,
      take: limit,
    });

    return {
      data: results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findByIds(ids: number[]) {
    return this.permissionRepository.find({
      where: {
        id: In(ids),
      },
    });
  }

  findOne(id: number) {
    return this.permissionRepository.findOne({ where: { id } });
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    try {
      return await this.permissionRepository.update(id, updatePermissionDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Permission code already exists');
      }
      throw error;
    }
  }

  remove(id: number) {
    return this.permissionRepository.delete(id);
  }
}
