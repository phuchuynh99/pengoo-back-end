import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, PaymentStatus } from '../../orders/order.entity';
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
        order.payment_status = PaymentStatus.PendingOnDelivery; // Use enum value
        await this.ordersRepository.save(order);
        return { message: 'Order placed. Pay on delivery.' };
      default:
        throw new BadRequestException('Unsupported payment method');
    }
  }

  async refundOrder(orderId: number) {
    // Implement refund logic or throw if not supported
    return { message: `Refund for order ${orderId} is not implemented.` };
  }

  async cancelOrder(orderId: number) {
    // Implement cancel logic or throw if not supported
    return { message: `Cancel for order ${orderId} is not implemented.` };
  }
}