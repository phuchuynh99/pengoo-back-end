import { Controller, Post, Delete, Get, Param, Req, Body } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Request } from 'express';
import { Public } from '../auth/public.decorator'; // Add this import

interface AuthenticatedRequest extends Request {
  user: { id: number; [key: string]: any };
}

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post(':productId')
  @Public()
  addToWishlist(@Body() body: { userId: number }, @Param('productId') productId: string) {
    // Lấy userId từ body thay vì req.user
    return this.wishlistService.addToWishlist(body.userId, Number(productId));
  }

  @Delete(':productId')
  @Public()
  removeFromWishlist(@Body() body: { userId: number }, @Param('productId') productId: string) {
    return this.wishlistService.removeFromWishlist(body.userId, Number(productId));
  }

  @Get()
  @Public()
  viewWishlist(@Body() body: { userId: number }) {
    return this.wishlistService.viewWishlist(body.userId);
  }

  @Post('move-to-order/:orderId')
  @Public()
  async moveToOrder(@Body() body: { userId: number }, @Param('orderId') orderId: string) {
    return this.wishlistService.moveWishlistToOrder(body.userId, Number(orderId));
  }
}
