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
exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const reviews_service_1 = require("./reviews.service");
const create_review_dto_1 = require("./create-review.dto");
const update_review_dto_1 = require("./update-review.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const public_decorator_1 = require("../auth/public.decorator");
let ReviewsController = class ReviewsController {
    reviewsService;
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    async addReview(req, productId, createReviewDto) {
        const userId = req.user.id;
        return this.reviewsService.addReview(userId, productId, createReviewDto);
    }
    async updateReview(req, reviewId, updateReviewDto) {
        const userId = req.user.id;
        return this.reviewsService.updateReview(userId, reviewId, updateReviewDto);
    }
    async updateReviewStatus(reviewId, status) {
        return this.reviewsService.updateReviewStatus(reviewId, status);
    }
    async deleteReview(req, reviewId) {
        const userId = req.user.id;
        return this.reviewsService.deleteReview(userId, reviewId);
    }
    async getProductReviews(productId) {
        return this.reviewsService.getProductReviews(productId);
    }
    async getUserReviews(userId) {
        return this.reviewsService.getUserReviews(userId);
    }
    async getAllReviews() {
        return this.reviewsService.getAllReviews();
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Post)(':productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a review to a product' }),
    (0, swagger_1.ApiParam)({ name: 'productId', type: Number }),
    (0, swagger_1.ApiBody)({
        type: create_review_dto_1.CreateReviewDto,
        examples: {
            sample: {
                summary: 'Sample review',
                value: {
                    rating: 5,
                    content: 'Amazing product! Highly recommended.',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Review created' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('productId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, create_review_dto_1.CreateReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "addReview", null);
__decorate([
    (0, common_1.Patch)(':reviewId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a review' }),
    (0, swagger_1.ApiParam)({ name: 'reviewId', type: Number }),
    (0, swagger_1.ApiBody)({
        type: update_review_dto_1.UpdateReviewDto,
        examples: {
            sample: {
                summary: 'Sample update',
                value: {
                    rating: 4,
                    comment: 'Updated my review after more use.',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review updated' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('reviewId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_review_dto_1.UpdateReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "updateReview", null);
__decorate([
    (0, common_1.Patch)(':reviewId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update review status (Visible/Hidden)' }),
    (0, swagger_1.ApiParam)({ name: 'reviewId', type: Number }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', enum: ['Visible', 'Hidden'] },
            },
            required: ['status'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review status updated' }),
    __param(0, (0, common_1.Param)('reviewId')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "updateReviewStatus", null);
__decorate([
    (0, common_1.Delete)(':reviewId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a review' }),
    (0, swagger_1.ApiParam)({ name: 'reviewId', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Review deleted' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('reviewId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "deleteReview", null);
__decorate([
    (0, common_1.Get)('product/:productId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reviews for a product' }),
    (0, swagger_1.ApiParam)({ name: 'productId', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of reviews' }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getProductReviews", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reviews by a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of reviews by user' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getUserReviews", null);
__decorate([
    (0, common_1.Get)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all reviews' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all reviews' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getAllReviews", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, swagger_1.ApiTags)('reviews'),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('reviews'),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], ReviewsController);
//# sourceMappingURL=reviews.controller.js.map