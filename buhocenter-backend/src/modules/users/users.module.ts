import {Customer} from './entities/customer.entity';
import {HttpModule, Module, forwardRef} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import {LanguagesService} from './services/languages.service';
import {LanguagesController} from './controllers/languages.controller';
import {LanguageRepository} from './repositories/language.repository';
import { AuthModule } from '../auth/auth.module';

@Module({

  imports: [TypeOrmModule.forFeature([Customer]), HttpModule, AuthModule],
  controllers: [UsersController, LanguagesController],
  providers: [UsersService, LanguagesService, LanguageRepository],
  exports:[UsersService]

})
export class UsersModule {}
