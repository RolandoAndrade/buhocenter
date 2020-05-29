import { Module } from '@nestjs/common';
import { PlatformManagementService } from './services/platform-management.service';
import { PlatformManagementController } from './controllers/platform-management.controller';
import { platformManagementEntities } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature(platformManagementEntities),
  ],
  providers: [PlatformManagementService],
  controllers: [PlatformManagementController],
  exports: [PlatformManagementService]
})
export class PlatformManagementModule {}
