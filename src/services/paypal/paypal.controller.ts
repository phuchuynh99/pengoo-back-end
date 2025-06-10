import { Controller, Post, Param } from '@nestjs/common';
import { PaymentsService } from '../payment/payment.service';
import { PaypalService } from './paypal.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly paypalService: PaypalService,
  ) {}

  @Post('stripe/create-payment-intent/:orderId')
  createStripePaymentIntent(@Param('orderId') orderId: number) {
    return this.paymentsService.createPaymentIntent(orderId);
  }

  @Post('paypal/create-order/:orderId')
  createPaypalOrder(@Param('orderId') orderId: number) {
    return this.paypalService.createOrder(orderId);
  }

  @Post('paypal/capture-order/:orderId')
  capturePaypalOrder(@Param('orderId') orderId: string) {
    return this.paypalService.captureOrder(orderId);
  }
}
