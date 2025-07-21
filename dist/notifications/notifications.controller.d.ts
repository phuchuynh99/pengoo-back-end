import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    sendEmail(body: {
        to: string;
        subject: string;
        message: string;
    }): Promise<{
        message: string;
    }>;
    sendOrderConfirmation(body: {
        email: string;
        orderId: number;
    }): Promise<{
        message: string;
    }>;
    sendShippingUpdate(body: {
        email: string;
        orderId: number;
        status: string;
    }): Promise<{
        message: string;
    }>;
    sendPasswordReset(body: {
        email: string;
        token: string;
    }): Promise<{
        message: string;
    }>;
}
