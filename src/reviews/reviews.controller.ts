import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './create-review.dto';
import { UpdateReviewDto } from './update-review.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator'; // Adjust the path if needed

@ApiTags('reviews')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':productId')
  @ApiOperation({ summary: 'Add a review to a product' })
  @ApiParam({ name: 'productId', type: Number })
  @ApiBody({
    type: CreateReviewDto,
    examples: {
      sample: {
        summary: 'Sample review',
        value: {
          rating: 5,
          content: 'Amazing product! Highly recommended.',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Review created' })
  async addReview(
    @Request() req,
    @Param('productId') productId: number,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    const userId = req.user.id;
    return this.reviewsService.addReview(userId, productId, createReviewDto);
  }

  @Patch(':reviewId')
  @ApiOperation({ summary: 'Update a review' })
  @ApiParam({ name: 'reviewId', type: Number })
  @ApiBody({
    type: UpdateReviewDto,
    examples: {
      sample: {
        summary: 'Sample update',
        value: {
          rating: 4,
          comment: 'Updated my review after more use.',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Review updated' })
  async updateReview(
    @Request() req,
    @Param('reviewId') reviewId: number,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const userId = req.user.id;
    return this.reviewsService.updateReview(userId, reviewId, updateReviewDto);
  }

  @Patch(':reviewId/status')
  @ApiOperation({ summary: 'Update review status (Visible/Hidden)' })
  @ApiParam({ name: 'reviewId', type: Number })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', enum: ['Visible', 'Hidden'] },
      },
      required: ['status'],
    },
  })
  @ApiResponse({ status: 200, description: 'Review status updated' })
  async updateReviewStatus(
    @Param('reviewId') reviewId: number,
    @Body('status') status: 'Visible' | 'Hidden',
  ) {
    return this.reviewsService.updateReviewStatus(reviewId, status);
  }

  @Delete(':reviewId')
  @ApiOperation({ summary: 'Delete a review' })
  @ApiParam({ name: 'reviewId', type: Number })
  @ApiResponse({ status: 200, description: 'Review deleted' })
  async deleteReview(
    @Request() req,
    @Param('reviewId') reviewId: number,
  ) {
    const userId = req.user.id;
    return this.reviewsService.deleteReview(userId, reviewId);
  }

  @Get('product/:productId')
  @Public()
  @ApiOperation({ summary: 'Get all reviews for a product' })
  @ApiParam({ name: 'productId', type: Number })
  @ApiResponse({ status: 200, description: 'List of reviews' })
  async getProductReviews(@Param('productId') productId: number) {
    return this.reviewsService.getProductReviews(productId);
  }

  @Get('user/:userId')
  @Public()
  @ApiOperation({ summary: 'Get all reviews by a user' })
  @ApiParam({ name: 'userId', type: Number })
  @ApiResponse({ status: 200, description: 'List of reviews by user' })
  async getUserReviews(@Param('userId') userId: number) {
    return this.reviewsService.getUserReviews(userId);
  }
}