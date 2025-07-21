import { Cart } from '../cart/cart.entity';
import { Review } from '../reviews/review.entity';
import { Wishlist } from '../wishlist/wishlist.entity';
import { TicketEarningLog } from '../minigame/ticket-earning-log.entity';
import { UserCoupon } from '../coupons/user-coupon.entity';
export declare class User {
    id: number;
    username: string;
    full_name: string;
    password: string;
    email: string;
    role: string;
    phone_number: string;
    avatar_url: string;
    status: boolean;
    address: string;
    points: number;
    minigame_tickets: number;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    reviews: Review[];
    wishlists: Wishlist[];
    carts: Cart[];
    ticketEarningLogs: TicketEarningLog[];
    userCoupons: UserCoupon[];
    lastFreeTicketClaim: Date | null;
    mfaCode: string | null;
    mfaCodeExpires: Date | null;
}
