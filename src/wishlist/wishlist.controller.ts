import { Controller, Post, Delete, Get, Param, Req, Body } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { id: number; [key: string]: any };
}

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post(':productId')
  addToWishlist(@Req() req: AuthenticatedRequest, @Param('productId') productId: string) {
    const userId = req.user.id;
    return this.wishlistService.addToWishlist(userId, Number(productId));
  }

  @Delete(':productId')
  removeFromWishlist(@Req() req: AuthenticatedRequest, @Param('productId') productId: string) {
    const userId = req.user.id;
    return this.wishlistService.removeFromWishlist(userId, Number(productId));
  }

  @Get()
  viewWishlist(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.wishlistService.viewWishlist(userId);
  }

  @Post('move-to-order/:orderId')
  async moveToOrder(@Req() req: AuthenticatedRequest, @Param('orderId') orderId: string) {
    const userId = req.user.id;
    return this.wishlistService.moveWishlistToOrder(userId, Number(orderId));
  }
}
