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

  @Post('refund/:orderId')
  async refundOrder(@Param('orderId') orderId: number) {
    return this.paymentsService.refundOrder(orderId);
  }

  @Post('cancel/:orderId')
  async cancelOrder(@Param('orderId') orderId: number) {
    return this.paymentsService.cancelOrder(orderId);
  }
}