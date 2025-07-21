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
exports.DeliveryController = void 0;
const common_1 = require("@nestjs/common");
const delivery_service_1 = require("./delivery.service");
const create_delivery_dto_1 = require("./dto/create-delivery.dto");
const update_delivery_dto_1 = require("./dto/update-delivery.dto");
const public_decorator_1 = require("../auth/public.decorator");
const swagger_1 = require("@nestjs/swagger");
let DeliveryController = class DeliveryController {
    deliveryService;
    constructor(deliveryService) {
        this.deliveryService = deliveryService;
    }
    create(dto) {
        return this.deliveryService.create(dto);
    }
    findAll() {
        return this.deliveryService.findAll();
    }
    findById(id) {
        return this.deliveryService.findById(id);
    }
    update(id, dto) {
        return this.deliveryService.update(id, dto);
    }
    remove(id) {
        return this.deliveryService.remove(id);
    }
};
exports.DeliveryController = DeliveryController;
__decorate([
    (0, common_1.Post)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new delivery method' }),
    (0, swagger_1.ApiBody)({
        type: create_delivery_dto_1.CreateDeliveryDto,
        examples: {
            default: {
                summary: 'Create delivery',
                value: {
                    name: 'Grab VN',
                    description: 'Fast delivery with Grab',
                    fee: 30000,
                    estimatedTime: '30-45 mins',
                    isAvailable: true,
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_delivery_dto_1.CreateDeliveryDto]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all delivery methods' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get delivery method by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update delivery method by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    (0, swagger_1.ApiBody)({
        type: update_delivery_dto_1.UpdateDeliveryDto,
        examples: {
            default: {
                summary: 'Update delivery',
                value: {
                    name: 'Grab Express',
                    description: 'Express delivery',
                    fee: 40000,
                    estimatedTime: '20-30 mins',
                    isAvailable: false,
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_delivery_dto_1.UpdateDeliveryDto]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete delivery method by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "remove", null);
exports.DeliveryController = DeliveryController = __decorate([
    (0, swagger_1.ApiTags)('Delivery'),
    (0, common_1.Controller)('delivery'),
    __metadata("design:paramtypes", [delivery_service_1.DeliveryService])
], DeliveryController);
//# sourceMappingURL=delivery.controller.js.map