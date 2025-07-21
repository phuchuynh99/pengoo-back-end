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
exports.PostCatalogueController = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const post_catalogue_entity_1 = require("./post-catalogue.entity");
const create_post_catalogue_dto_1 = require("./dto/create-post-catalogue.dto");
const update_post_catalogue_dto_1 = require("./dto/update-post-catalogue.dto");
let PostCatalogueController = class PostCatalogueController {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll() {
        return this.repo.find();
    }
    async create(dto) {
        const catalogue = this.repo.create(dto);
        return this.repo.save(catalogue);
    }
    async update(id, dto) {
        await this.repo.update(id, dto);
        return this.repo.findOne({ where: { id: Number(id) } });
    }
    async remove(id) {
        const postCount = await this.repo.manager.getRepository('Post').count({ where: { catalogue: { id } } });
        if (postCount > 0) {
            throw new Error('Cannot delete: This catalogue is still used by one or more posts.');
        }
        await this.repo.delete(id);
        return { success: true };
    }
};
exports.PostCatalogueController = PostCatalogueController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostCatalogueController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_post_catalogue_dto_1.CreatePostCatalogueDto]),
    __metadata("design:returntype", Promise)
], PostCatalogueController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_post_catalogue_dto_1.UpdatePostCatalogueDto]),
    __metadata("design:returntype", Promise)
], PostCatalogueController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostCatalogueController.prototype, "remove", null);
exports.PostCatalogueController = PostCatalogueController = __decorate([
    (0, common_1.Controller)('post-catalogues'),
    __param(0, (0, typeorm_1.InjectRepository)(post_catalogue_entity_1.PostCatalogue)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PostCatalogueController);
//# sourceMappingURL=post-catalogue.controller.js.map