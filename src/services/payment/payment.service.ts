import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, PaymentStatus, ProductStatus } from '../../orders/order.entity';
import { UsersService } from '../../users/users.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private usersService: UsersService,
  ) {
    this.stripe = new Stripe('YOUR_STRIPE_SECRET_KEY', {
      apiVersion: '2025-05-28.basil',
    });
  }

  async createPaymentIntent(orderId: number): Promise<Stripe.PaymentIntent> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    if (typeof order.total_price !== 'number') {
      throw new Error('Order total_price is not a number');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.total_price),
      currency: 'vnd',
      metadata: { orderId: order.id.toString() },
    });

    return paymentIntent;
  }

  async handleWebhook(event: Stripe.Event): Promise<void> {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      const order = await this.ordersRepository.findOne({ where: { id: Number(orderId) } });
      if (order) {
        order.payment_status = PaymentStatus.Paid;
        await this.ordersRepository.save(order);
      }
    }
  }

  async refundOrder(orderId: number): Promise<any> {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });
    if (!order) throw new BadRequestException('Order not found');
    if (order.payment_status === PaymentStatus.Refunded) throw new BadRequestException('Order already refunded');
    if (order.payment_status !== PaymentStatus.Paid) throw new BadRequestException('Order not paid');
    if (order.productStatus === 'cancelled') throw new BadRequestException('Order is cancelled');

    // Optionally: use paymentIntentId from order if you store it
    let paymentIntentId: string | undefined;
    // Example: paymentIntentId = order.paymentIntentId;
    if (!paymentIntentId) {
      const paymentIntents = await this.stripe.paymentIntents.list({
        limit: 10,
      });
      const paymentIntent = paymentIntents.data.find(
        pi => pi.metadata?.orderId === orderId.toString()
      );
      if (!paymentIntent) throw new BadRequestException('Payment intent not found');
      paymentIntentId = paymentIntent.id;
    }

    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    order.payment_status = PaymentStatus.Refunded;
    await this.ordersRepository.save(order);

    return refund;
  }

  async cancelOrder(orderId: number): Promise<any> {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });
    if (!order) throw new BadRequestException('Order not found');
    if (order.productStatus === ProductStatus.Cancelled) throw new BadRequestException('Order already cancelled');
    if (['shipped', 'delivered'].includes(order.productStatus)) {
      throw new BadRequestException('Cannot cancel order after it is shipped or delivered');
    }

    // If paid and not refunded, refund
    if (order.payment_status === PaymentStatus.Paid) {
      await this.refundOrder(orderId);
    }

    order.productStatus = ProductStatus.Cancelled;
    await this.ordersRepository.save(order);

    return { message: 'Order cancelled successfully' };
  }

  public getStripe(): Stripe {
    return this.stripe;
  }
}