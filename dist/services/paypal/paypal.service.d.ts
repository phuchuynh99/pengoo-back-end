import { OrdersService } from '../../orders/orders.service';
import { ConfigService } from '@nestjs/config';
export declare class PaypalService {
    private ordersService;
    private configService;
    private environment;
    private client;
    constructor(ordersService: OrdersService, configService: ConfigService);
    createOrder(orderId: number): Promise<any>;
    captureOrder(orderId: string): Promise<any>;
    refundOrder(orderId: number): Promise<{
        message: string;
    }>;
}
