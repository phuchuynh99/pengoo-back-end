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
exports.PublishersController = void 0;
const common_1 = require("@nestjs/common");
const publishers_service_1 = require("./publishers.service");
const create_publisher_dto_1 = require("./dto/create-publisher.dto");
const update_publisher_dto_1 = require("./dto/update-publisher.dto");
const public_decorator_1 = require("../auth/public.decorator");
let PublishersController = class PublishersController {
    publishersService;
    constructor(publishersService) {
        this.publishersService = publishersService;
    }
    create(dto) {
        return this.publishersService.create(dto);
    }
    findAll() {
        return this.publishersService.findAll();
    }
    findOne(id) {
        return this.publishersService.findOne(+id);
    }
    update(id, dto) {
        return this.publishersService.update(+id, dto);
    }
    remove(id) {
        return this.publishersService.remove(+id);
    }
};
exports.PublishersController = PublishersController;
__decorate([
    (0, common_1.Post)(),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_publisher_dto_1.CreatePublisherDto]),
    __metadata("design:returntype", void 0)
], PublishersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublishersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublishersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_publisher_dto_1.UpdatePublisherDto]),
    __metadata("design:returntype", void 0)
], PublishersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, public_decorator_1.Public)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublishersController.prototype, "remove", null);
exports.PublishersController = PublishersController = __decorate([
    (0, common_1.Controller)('publishers'),
    __metadata("design:paramtypes", [publishers_service_1.PublishersService])
], PublishersController);
//# sourceMappingURL=publishers.controller.js.map