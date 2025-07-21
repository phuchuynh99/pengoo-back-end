import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './create-review.dto';
import { UpdateReviewDto } from './update-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    addReview(req: any, productId: number, createReviewDto: CreateReviewDto): Promise<import("./review.entity").Review>;
    updateReview(req: any, reviewId: number, updateReviewDto: UpdateReviewDto): Promise<import("./review.entity").Review>;
    updateReviewStatus(reviewId: number, status: 'Visible' | 'Hidden'): Promise<import("./review.entity").Review>;
    deleteReview(req: any, reviewId: number): Promise<void>;
    getProductReviews(productId: number): Promise<import("./review.entity").Review[]>;
    getUserReviews(userId: number): Promise<import("./review.entity").Review[]>;
    getAllReviews(): Promise<import("./review.entity").Review[]>;
}
