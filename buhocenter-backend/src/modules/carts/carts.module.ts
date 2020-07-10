import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartsService } from './services/carts.service';
import { CartsController } from './controllers/carts.controller';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { StatussModule } from '../status/status.module';

@Module({
    imports: [TypeOrmModule.forFeature([Cart]), UsersModule, ProductsModule, StatussModule],
    controllers: [CartsController],
    providers: [CartsService],
    exports: [CartsService],
})
export class CartsModule {}
