import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../orders/order.entity';
import { PaymentMethod } from './payment.types';
import { PaypalService } from '../paypal/paypal.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private paypalService: PaypalService,
  ) {}

  async pay(orderId: number, method: PaymentMethod) {
    const order = await this.ordersRepository.findOne({ where: { id: orderId } });
    if (!order) throw new BadRequestException('Order not found');

    switch (method) {
      case PaymentMethod.PAYPAL:
        // Create PayPal order and return approval link
        return this.paypalService.createOrder(orderId);
      case PaymentMethod.ON_DELIVERY:
        // Mark order as "payment pending" or similar
        order.payment_status = 'pending_on_delivery';
        await this.ordersRepository.save(order);
        return { message: 'Order placed. Pay on delivery.' };
      default:
        throw new BadRequestException('Unsupported payment method');
    }
  }
}