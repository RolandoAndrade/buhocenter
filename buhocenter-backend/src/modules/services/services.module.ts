import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services/services.service' 
import { Service } from './entities/service.entity'
import { ServiceRating } from './entities/service-rating.entity';
import { ServicesController } from './controllers/services.controller'

@Module({
  imports: [ TypeOrmModule.forFeature([ Service, ServiceRating ])],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService]
})
export class ServicesModule {}
