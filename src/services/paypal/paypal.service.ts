import { Injectable } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import { OrdersService } from '../../orders/orders.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaypalService {
  private environment: paypal.core.SandboxEnvironment;
  private client: paypal.core.PayPalHttpClient;

  constructor(
    private ordersService: OrdersService,
    private configService: ConfigService
  ) {
    this.environment = new paypal.core.SandboxEnvironment(
      this.configService.get<string>('PAYPAL_CLIENT_ID'),
      this.configService.get<string>('PAYPAL_CLIENT_SECRET')
    );
    this.client = new paypal.core.PayPalHttpClient(this.environment);
  }

  async createOrder(orderId: number) {
    const order = await this.ordersService.findById(orderId);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'VND',
          value: order.total_price.toString(),
        },
      }],
    });

    const response = await this.client.execute(request);
    return response.result;
  }

  async captureOrder(orderId: string) {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const response = await this.client.execute(request);
    return response.result;
  }

  async refundOrder(orderId: number) {
    // Implement PayPal refund logic here
    // You may need to store PayPal order/capture IDs in your Order entity for this
    // For now, just return a stub
    return { message: `Refund for PayPal order ${orderId} is not implemented.` };
  }
}
