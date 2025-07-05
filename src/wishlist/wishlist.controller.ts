import { Controller, Post, Delete, Get, Param, Body, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

// Swagger imports
import { ApiTags, ApiBody, ApiParam, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

interface WishlistBody {
  userId: number;
}

@ApiTags('Wishlist')
@ApiBearerAuth()
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post(':productId')
  @Roles('user')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Add product to wishlist' })
  @ApiParam({ name: 'productId', type: Number, required: true })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1 },
      },
      required: ['userId'],
    },
    examples: {
      user: {
        summary: 'Add to wishlist',
        value: { userId: 1 },
      },
    },
  })
  addToWishlist(@Body() body: WishlistBody, @Param('productId') productId: string) {
    return this.wishlistService.addToWishlist(body.userId, Number(productId));
  }

  @Delete(':productId')
  @Roles('user')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Remove product from wishlist' })
  @ApiParam({ name: 'productId', type: Number, required: true })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1 },
      },
      required: ['userId'],
    },
    examples: {
      user: {
        summary: 'Remove from wishlist',
        value: { userId: 1 },
      },
    },
  })
  removeFromWishlist(@Body() body: WishlistBody, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(body.userId, Number(productId));
  }

  @Get()
  @Roles('user')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'View wishlist' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1 },
      },
      required: ['userId'],
    },
    examples: {
      user: {
        summary: 'View wishlist',
        value: { userId: 1 },
      },
    },
  })
  viewWishlist(@Body() body: WishlistBody) {
    return this.wishlistService.viewWishlist(body.userId);
  }

  @Post('move-to-order/:orderId')
  @Roles('user')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Move wishlist items to order' })
  @ApiParam({ name: 'orderId', type: Number, required: true })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'number', example: 1 },
      },
      required: ['userId'],
    },
    examples: {
      user: {
        summary: 'Move to order',
        value: { userId: 1 },
      },
    },
  })
  async moveToOrder(@Body() body: WishlistBody, @Param('orderId') orderId: string) {
    return this.wishlistService.moveWishlistToOrder(body.userId, Number(orderId));
  }
}
