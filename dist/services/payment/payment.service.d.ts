import { Repository, DataSource } from 'typeorm';
import { Order } from '../../orders/order.entity';
import { PaymentMethod } from './payment.types';
import { PaypalService } from '../paypal/paypal.service';
export declare class PaymentsService {
    private ordersRepository;
    private paypalService;
    private dataSource;
    constructor(ordersRepository: Repository<Order>, paypalService: PaypalService, dataSource: DataSource);
    private assertCanAct;
    pay(orderId: number, method: PaymentMethod, userId: number, userRole: string): Promise<any>;
    handlePaypalCapture(orderId: number, userId: number, userRole: string): Promise<{
        message: string;
    }>;
    refundOrder(orderId: number, userId: number, userRole: string): Promise<{
        message: string;
    }>;
    cancelOrder(orderId: number, userId: number, userRole: string): Promise<{
        message: string;
    }>;
}
