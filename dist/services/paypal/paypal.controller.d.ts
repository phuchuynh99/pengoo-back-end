import { PaypalService } from './paypal.service';
export declare class PaypalController {
    private readonly paypalService;
    constructor(paypalService: PaypalService);
    createPaypalOrder(orderId: number): Promise<any>;
    capturePaypalOrder(orderId: string): Promise<any>;
}
