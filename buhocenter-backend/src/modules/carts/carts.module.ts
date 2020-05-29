import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity'
import { ProductCart } from './entities/product-cart.entity'
import { CartsService } from './services/carts.service'
import { CartsController } from './controllers/carts.controller'
import { UsersModule } from '../users/users.module'
import { ProductsModule } from '../products/products.module'
import { StatussModule } from '../status/status.module'
import { ServiceCart } from './entities/service-cart.entity'
import { ServicesModule } from '../services/services.module'

@Module({
  imports: [ TypeOrmModule.forFeature([Cart,ProductCart,ServiceCart]),
	  UsersModule,
	  ProductsModule,
	  StatussModule,
	  ServicesModule
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
