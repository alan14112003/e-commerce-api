import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, Reflector } from '@nestjs/core';

@Injectable()
export class PermissionScannerService implements OnModuleInit {
  private readonly permissionKey = 'permission';

  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    console.log('Permissions:', this.getAllPermissions());
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
