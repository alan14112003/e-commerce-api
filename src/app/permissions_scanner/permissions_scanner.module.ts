import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { PermissionScannerService } from './permission-scanner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../permissions/entities/permission.entity';
import { Role } from '../roles/entities/role.entity';

@Module({
  imports: [DiscoveryModule, TypeOrmModule.forFeature([Permission, Role])],
  providers: [PermissionScannerService],
  exports: [PermissionScannerService],
})
export class PermissionsScannerModule {}
