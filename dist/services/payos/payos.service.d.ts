export declare class PayosService {
    private readonly apiUrl;
    private readonly apiKey;
    private readonly clientId;
    private readonly clientSecret;
    createInvoice(data: {
        orderCode: number;
        amount: number;
        returnUrl: string;
        cancelUrl: string;
        description: string;
    }): Promise<any>;
}
