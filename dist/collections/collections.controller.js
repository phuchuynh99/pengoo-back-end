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
exports.CollectionsController = void 0;
const common_1 = require("@nestjs/common");
const collections_service_1 = require("./collections.service");
const create_collection_dto_1 = require("./dto/create-collection.dto");
const update_collection_dto_1 = require("./dto/update-collection.dto");
const public_decorator_1 = require("../auth/public.decorator");
let CollectionsController = class CollectionsController {
    collectionsService;
    constructor(collectionsService) {
        this.collectionsService = collectionsService;
    }
    findAll() {
        return this.collectionsService.findAll();
    }
    create(dto) {
        return this.collectionsService.create(dto);
    }
    getOne(slug) {
        return this.collectionsService.findOne(slug);
    }
    update(id, dto) {
        return this.collectionsService.update(Number(id), dto);
    }
    remove(id) {
        return this.collectionsService.remove(Number(id));
    }
};
exports.CollectionsController = CollectionsController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_collection_dto_1.CreateCollectionDto]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)("slug/:slug"),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "getOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_collection_dto_1.UpdateCollectionDto]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CollectionsController.prototype, "remove", null);
exports.CollectionsController = CollectionsController = __decorate([
    (0, common_1.Controller)('collections'),
    __metadata("design:paramtypes", [collections_service_1.CollectionsService])
], CollectionsController);
//# sourceMappingURL=collections.controller.js.map