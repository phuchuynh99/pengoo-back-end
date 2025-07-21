import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { CreateReviewDto } from './create-review.dto';
import { UpdateReviewDto } from './update-review.dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { Order } from '../orders/order.entity';
export declare class ReviewsService {
    private reviewsRepository;
    private usersService;
    private productsService;
    private ordersRepository;
    constructor(reviewsRepository: Repository<Review>, usersService: UsersService, productsService: ProductsService, ordersRepository: Repository<Order>);
    addReview(userId: number, productId: number, createReviewDto: CreateReviewDto): Promise<Review>;
    updateReview(userId: number, reviewId: number, updateReviewDto: UpdateReviewDto): Promise<Review>;
    updateReviewStatus(reviewId: number, status: 'Visible' | 'Hidden'): Promise<Review>;
    deleteReview(userId: number, reviewId: number): Promise<void>;
    getProductReviews(productId: number): Promise<Review[]>;
    getUserReviews(userId: number): Promise<Review[]>;
    getAllReviews(): Promise<Review[]>;
}
