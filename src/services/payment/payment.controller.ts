import { Controller, Post, Param, Req, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payment.service';
import { Request } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-intent/:orderId')
  createPaymentIntent(@Param('orderId') orderId: number) {
    return this.paymentsService.createPaymentIntent(orderId);
  }

  @Post('webhook')
  async handleWebhook(@Req() request: Request) {
    const sig = request.headers['stripe-signature'];
    if (!sig || typeof sig !== 'string') {
      throw new BadRequestException('Missing Stripe signature');
    }
    const stripeEvent = this.paymentsService.getStripe().webhooks.constructEvent(
      request.body,
      sig,
      'YOUR_STRIPE_WEBHOOK_SECRET'
    );

    await this.paymentsService.handleWebhook(stripeEvent);
    return { received: true };
  }
}