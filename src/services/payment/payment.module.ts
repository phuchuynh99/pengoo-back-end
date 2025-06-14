import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payment.service';
import { PaymentsController } from './payment.controller';
import { Order } from '../../orders/order.entity';
import { UsersModule } from '../../users/users.module';
import { PaypalService } from '../paypal/paypal.service';
import { OrdersModule } from '../../orders/orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UsersModule, OrdersModule],
  providers: [PaymentsService, PaypalService],
  controllers: [PaymentsController],
  exports: [PaymentsService, PaypalService],
})
export class PaymentModule {}