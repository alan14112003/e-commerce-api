import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { UpdateRolePermissionsDto } from './dto/update-role-permissions.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    private permissionsService: PermissionsService,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    try {
      const { name, descriptions, code, permissionIds } = createRoleDto;

      // Tìm danh sách Permission từ database
      const permissions =
        await this.permissionsService.findByIds(permissionIds);

      // Tạo role mới
      const newRole = this.roleRepository.create({
        name,
        descriptions,
        code,
        permissions, // Gán permissions vào role
      });

      return await this.roleRepository.save(newRole);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Role code already exists');
      }
      throw error;
    }
  }

  findAll() {
    return this.roleRepository.find();
  }

  findOne(id: number) {
    return this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    try {
      return this.roleRepository.update(id, updateRoleDto);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Role code already exists');
      }

      throw error;
    }
  }

  async updatePermissions(
    roleId: number,
    updateRolePermissionsDto: UpdateRolePermissionsDto,
  ) {
    const { permissionIds } = updateRolePermissionsDto;

    // Tìm role cần cập nhật
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) throw new NotFoundException('Role not found');

    // Lấy danh sách permissions từ database
    const permissions = await this.permissionsService.findByIds(permissionIds);

    // Gán lại danh sách permissions
    role.permissions = permissions;

    return await this.roleRepository.save(role);
  }

  remove(id: number) {
    return this.roleRepository.delete(id);
  }

  async findOneNotRelation(id: number) {
    return this.roleRepository.findOne({ where: { id } });
  }
}
