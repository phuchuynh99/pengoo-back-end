import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../orders/order.entity';
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
    if (typeof order.total !== 'number') {
      throw new BadRequestException('Order total is missing');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.total), 
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
        order.status = 'paid'; // Use 'status' if that's your payment status field
        await this.ordersRepository.save(order);
      }
    }
  }

  public getStripe(): Stripe {
    return this.stripe;
  }
}