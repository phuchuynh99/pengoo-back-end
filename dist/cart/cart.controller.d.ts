import { CartService } from './cart.service';
import { CreateCartItemDto } from './create-cart-item.dto';
import { UpdateCartItemDto } from './update-cart-item.dto';
import { Request } from 'express';
interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        [key: string]: any;
    };
}
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addItem(req: AuthenticatedRequest, createCartItemDto: CreateCartItemDto): Promise<import("./cart.entity").Cart>;
    updateItem(req: AuthenticatedRequest, itemId: number, updateCartItemDto: UpdateCartItemDto): Promise<import("./cart.entity").Cart>;
    removeItem(req: AuthenticatedRequest, itemId: number): Promise<import("./cart.entity").Cart>;
    getCartSummary(req: AuthenticatedRequest): Promise<import("./cart.entity").Cart>;
    checkout(req: AuthenticatedRequest): Promise<{
        message: string;
    }>;
}
export {};
