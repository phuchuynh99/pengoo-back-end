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
exports.ImagesController = void 0;
const common_1 = require("@nestjs/common");
const images_service_1 = require("./images.service");
const create_image_dto_1 = require("./dto/create-image.dto");
const update_image_dto_1 = require("./dto/update-image.dto");
const swagger_1 = require("@nestjs/swagger");
require("../cloudinary.config");
const cloudinary_1 = require("cloudinary");
let ImagesController = class ImagesController {
    imagesService;
    constructor(imagesService) {
        this.imagesService = imagesService;
    }
    create(createImageDto) {
        return this.imagesService.create(createImageDto);
    }
    findAll() {
        return this.imagesService.findAll();
    }
    findOne(id) {
        return this.imagesService.findOne(+id);
    }
    update(id, updateImageDto) {
        return this.imagesService.update(+id, updateImageDto);
    }
    async remove(id) {
        const image = await this.imagesService.findOne(+id);
        const match = image.url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
        const publicId = match ? match[1] : null;
        if (publicId) {
            try {
                await cloudinary_1.v2.uploader.destroy(publicId);
            }
            catch (e) {
            }
        }
        return this.imagesService.remove(+id);
    }
    async deleteCloudinary(publicId) {
        try {
            await cloudinary_1.v2.uploader.destroy(publicId);
            return { success: true };
        }
        catch (e) {
            return { success: false, error: e.message };
        }
    }
    async deleteFolder(path) {
        return this.imagesService.deleteFolder(path);
    }
    async getFolderTree() {
        const images = await this.imagesService.findAll();
        return Array.from(new Set(images.map(img => img.folder || 'default')));
    }
};
exports.ImagesController = ImagesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new image' }),
    (0, swagger_1.ApiBody)({
        type: create_image_dto_1.CreateImageDto,
        examples: {
            default: {
                summary: 'Create image',
                value: {
                    url: 'https://example.com/image.jpg',
                    name: 'Sample Image',
                    folder: 'products',
                    ord: 1,
                    product: { id: 1 }
                }
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_image_dto_1.CreateImageDto]),
    __metadata("design:returntype", void 0)
], ImagesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all images' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ImagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get image by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ImagesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update image by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    (0, swagger_1.ApiBody)({
        type: update_image_dto_1.UpdateImageDto,
        examples: {
            default: {
                summary: 'Update image',
                value: {
                    url: 'https://example.com/image2.jpg',
                    name: 'Updated Image',
                    ord: 2,
                    product: { id: 1 },
                    folder: 'folder1/folder2'
                }
            }
        }
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_image_dto_1.UpdateImageDto]),
    __metadata("design:returntype", void 0)
], ImagesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete image by ID (also deletes from Cloudinary)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, example: 1 }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('delete-cloudinary'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete image from Cloudinary by publicId' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                publicId: { type: 'string', example: 'folder/filename' },
            },
            required: ['publicId'],
        },
    }),
    __param(0, (0, common_1.Body)('publicId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "deleteCloudinary", null);
__decorate([
    (0, common_1.Delete)('folder'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete all images in a folder (and subfolders) from DB and Cloudinary' }),
    __param(0, (0, common_1.Query)('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "deleteFolder", null);
__decorate([
    (0, common_1.Get)('folders'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all folder paths' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ImagesController.prototype, "getFolderTree", null);
exports.ImagesController = ImagesController = __decorate([
    (0, swagger_1.ApiTags)('Images'),
    (0, common_1.Controller)('images'),
    __metadata("design:paramtypes", [images_service_1.ImagesService])
], ImagesController);
//# sourceMappingURL=images.controller.js.map