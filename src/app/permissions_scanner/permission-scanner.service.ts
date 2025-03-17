import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { In, Repository } from 'typeorm';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class PermissionScannerService implements OnModuleInit {
  private readonly permissionKey = 'permission';

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    const requiredPermissions = this.getAllPermissions();
    console.log('Permissions:', requiredPermissions);

    // Lấy tất cả các quyền hiện có trong database
    const existingPermissions = await this.permissionRepository.find({
      where: { code: In(requiredPermissions) },
    });

    // Lọc ra các quyền chưa tồn tại trong database
    const existingPermissionCodes = existingPermissions.map((p) => p.code);
    const missingPermissions = requiredPermissions.filter(
      (code) => !existingPermissionCodes.includes(code),
    );

    const permissionInserts = missingPermissions.map((perCode) => {
      const [name, handle] = perCode.split('.');
      return {
        name: `${handle} ${name}`,
        code: perCode,
      };
    });

    const permissionInserted =
      await this.permissionRepository.insert(permissionInserts);
    console.log(permissionInserted);

    const roleAdmin = await this.roleRepository.findOne({
      where: { code: 'admin' },
      relations: ['permissions'],
    });

    const fullPermissions = await this.permissionRepository.find();
    if (roleAdmin) {
      roleAdmin.permissions = fullPermissions;

      await this.roleRepository.save(roleAdmin);
    }
  }

  getAllPermissions(): string[] {
    const controllers = this.discoveryService.getControllers();
    const permissions = new Set<string>();

    controllers.forEach(({ instance }) => {
      if (!instance) return;

      const methods = Object.getOwnPropertyNames(
        Object.getPrototypeOf(instance),
      );
      methods.forEach((method) => {
        const permissionsMetadata =
          this.reflector.getAllAndMerge<string[]>(this.permissionKey, [
            instance[method],
          ]) || [];

        permissionsMetadata.forEach((perm) => permissions.add(perm));
      });
    });

    return Array.from(permissions);
  }
}
