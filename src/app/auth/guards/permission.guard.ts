import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionResponseDto } from 'src/app/permissions/dto/permission-response.dto';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      'permission',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    // Kiểm tra xem user có quyền cần thiết không

    return user.role.permissions.some(
      (permission: PermissionResponseDto) =>
        permission.code === requiredPermission,
    );
  }
}
