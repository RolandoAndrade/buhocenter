import { Module, forwardRef } from '@nestjs/common';
import { EmailsService } from './services/emails.service';
import { ProductsModule } from '../products/products.module';

@Module({
    imports: [ProductsModule],
    providers: [EmailsService],
    exports: [EmailsService],
})
export class NotificationsModule {}
