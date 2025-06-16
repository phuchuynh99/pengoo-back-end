import { Controller, Post, Param, Body } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { PaymentMethod } from './payment.types';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('pay/:orderId')
  pay(
    @Param('orderId') orderId: number,
    @Body('method') method: PaymentMethod,
  ) {
    return this.paymentsService.pay(orderId, method);
  }
}