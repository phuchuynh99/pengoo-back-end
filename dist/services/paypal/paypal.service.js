"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaypalService = void 0;
const common_1 = require("@nestjs/common");
const paypal = require("@paypal/checkout-server-sdk");
const orders_service_1 = require("../../orders/orders.service");
const config_1 = require("@nestjs/config");
let PaypalService = class PaypalService {
    ordersService;
    configService;
    environment;
    client;
    constructor(ordersService, configService) {
        this.ordersService = ordersService;
        this.configService = configService;
        this.environment = new paypal.core.SandboxEnvironment(this.configService.get('PAYPAL_CLIENT_ID'), this.configService.get('PAYPAL_CLIENT_SECRET'));
        this.client = new paypal.core.PayPalHttpClient(this.environment);
    }
    async createOrder(orderId) {
        const order = await this.ordersService.findById(orderId);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
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
    async captureOrder(orderId) {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});
        const response = await this.client.execute(request);
        return response.result;
    }
    async refundOrder(orderId) {
        return { message: `Refund for PayPal order ${orderId} is not implemented.` };
    }
};
exports.PaypalService = PaypalService;
exports.PaypalService = PaypalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        config_1.ConfigService])
], PaypalService);
//# sourceMappingURL=paypal.service.js.map