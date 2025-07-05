import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Public } from '../auth/public.decorator';

// Swagger imports
import { ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';

interface WishlistBody {
  userId: number;
}

@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post(':productId')
  @Public()
  @ApiParam({ name: 'productId', type: Number, required: true })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1 },
      },
      required: ['userId'],
    },
  })
  addToWishlist(@Body() body: WishlistBody, @Param('productId') productId: string) {
    return this.wishlistService.addToWishlist(body.userId, Number(productId));
  }

  @Delete(':productId')
  @Public()
  @ApiParam({ name: 'productId', type: Number, required: true })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1 },
      },
      required: ['userId'],
    },
  })
  removeFromWishlist(@Body() body: WishlistBody, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(body.userId, Number(productId));
  }

  @Get()
  @Public()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1 },
      },
      required: ['userId'],
    },
  })
  viewWishlist(@Body() body: WishlistBody) {
    return this.wishlistService.viewWishlist(body.userId);
  }

  @Post('move-to-order/:orderId')
  @Public()
  @ApiParam({ name: 'orderId', type: Number, required: true })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1 },
      },
      required: ['userId'],
    },
  })
  async moveToOrder(@Body() body: WishlistBody, @Param('orderId') orderId: string) {
    return this.wishlistService.moveWishlistToOrder(body.userId, Number(orderId));
  }
}
