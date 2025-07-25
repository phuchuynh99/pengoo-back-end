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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../../orders/order.entity");
const payment_types_1 = require("./payment.types");
const paypal_service_1 = require("../paypal/paypal.service");
let PaymentsService = class PaymentsService {
    ordersRepository;
    paypalService;
    dataSource;
    constructor(ordersRepository, paypalService, dataSource) {
        this.ordersRepository = ordersRepository;
        this.paypalService = paypalService;
        this.dataSource = dataSource;
    }
    async assertCanAct(userId, order, userRole) {
        if (order.user.id !== userId && userRole !== 'ADMIN') {
            throw new common_1.ForbiddenException('You are not allowed to perform this action on this order.');
        }
    }
    async pay(orderId, method, userId, userRole) {
        const order = await this.ordersRepository.findOne({
            where: { id: orderId },
            relations: ['user'],
        });
        if (!order)
            throw new common_1.BadRequestException('Order not found');
        await this.assertCanAct(userId, order, userRole);
        if (order.payment_status === order_entity_1.PaymentStatus.Paid) {
            throw new common_1.BadRequestException('Order is already paid.');
        }
        if (order.payment_status === order_entity_1.PaymentStatus.PendingOnDelivery && method === payment_types_1.PaymentMethod.ON_DELIVERY) {
            throw new common_1.BadRequestException('Order is already set for on-delivery payment.');
        }
        if (order.productStatus === 'cancelled') {
            throw new common_1.BadRequestException('Cannot pay for a cancelled order.');
        }
        switch (method) {
            case payment_types_1.PaymentMethod.PAYPAL:
                order.payment_status = order_entity_1.PaymentStatus.Pending;
                await this.ordersRepository.save(order);
                return this.paypalService.createOrder(orderId);
            case payment_types_1.PaymentMethod.ON_DELIVERY:
                order.payment_status = order_entity_1.PaymentStatus.PendingOnDelivery;
                await this.ordersRepository.save(order);
                return { message: 'Order placed. Pay on delivery.' };
            default:
                throw new common_1.BadRequestException('Unsupported payment method');
        }
    }
    async handlePaypalCapture(orderId, userId, userRole) {
        const order = await this.ordersRepository.findOne({
            where: { id: orderId },
            relations: ['user'],
        });
        if (!order)
            throw new common_1.BadRequestException('Order not found');
        await this.assertCanAct(userId, order, userRole);
        if (order.payment_status === order_entity_1.PaymentStatus.Paid) {
            throw new common_1.BadRequestException('Order is already paid.');
        }
        if (order.productStatus === 'cancelled') {
            throw new common_1.BadRequestException('Cannot capture payment for a cancelled order.');
        }
        order.payment_status = order_entity_1.PaymentStatus.Paid;
        await this.ordersRepository.save(order);
        return { message: 'Payment captured and order marked as paid.' };
    }
    async refundOrder(orderId, userId, userRole) {
        const order = await this.ordersRepository.findOne({
            where: { id: orderId },
            relations: ['user'],
        });
        if (!order)
            throw new common_1.BadRequestException('Order not found');
        await this.assertCanAct(userId, order, userRole);
        if (order.payment_status !== order_entity_1.PaymentStatus.Paid) {
            throw new common_1.BadRequestException('Order is not paid or already refunded.');
        }
        if (order.productStatus === 'cancelled') {
            throw new common_1.BadRequestException('Order is already cancelled.');
        }
        await this.dataSource.transaction(async (manager) => {
            if (order.payment_type === payment_types_1.PaymentMethod.PAYPAL) {
                await this.paypalService.refundOrder(order.id);
            }
            order.payment_status = order_entity_1.PaymentStatus.Refunded;
            order.productStatus = 'cancelled';
            await manager.save(order);
        });
        return { message: 'Order refunded and cancelled.' };
    }
    async cancelOrder(orderId, userId, userRole) {
        const order = await this.ordersRepository.findOne({
            where: { id: orderId },
            relations: ['user'],
        });
        if (!order)
            throw new common_1.BadRequestException('Order not found');
        await this.assertCanAct(userId, order, userRole);
        if (order.productStatus === 'cancelled') {
            throw new common_1.BadRequestException('Order is already cancelled.');
        }
        if (order.payment_status === order_entity_1.PaymentStatus.Paid) {
            return this.refundOrder(orderId, userId, userRole);
        }
        order.productStatus = 'cancelled';
        await this.ordersRepository.save(order);
        return { message: 'Order cancelled.' };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        paypal_service_1.PaypalService,
        typeorm_2.DataSource])
], PaymentsService);
//# sourceMappingURL=payment.service.js.map