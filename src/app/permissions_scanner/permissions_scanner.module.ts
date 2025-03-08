import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { PermissionScannerService } from './permission-scanner.service';

@Module({
  imports: [DiscoveryModule],
  providers: [PermissionScannerService],
  exports: [PermissionScannerService],
})
export class PermissionsScannerModule {}
