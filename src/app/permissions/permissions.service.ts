import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  findAll() {
    return this.permissionRepository.find();
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
