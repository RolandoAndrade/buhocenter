import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';
import { StatusService } from './services/status.service';
import { StatusHistory } from './entities/status-history.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Status, StatusHistory])],
    providers: [StatusService],
    exports: [StatusService],
})
export class StatussModule {}
