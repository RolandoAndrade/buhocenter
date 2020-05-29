import { Module } from '@nestjs/common';
import { NotificationsService } from './services/notifications.service';
import { NotificationsController } from './controllers/notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { notificationsEntities } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature(notificationsEntities),
  ],
  providers: [
    NotificationsService
  ],
  controllers: [
    NotificationsController
  ]
})
export class NotificationsModule {}
