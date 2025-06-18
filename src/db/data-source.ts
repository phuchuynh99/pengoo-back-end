import { config } from 'dotenv';
import { Category } from '../categories/category.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { DataSourceOptions } from 'typeorm';
import { Order, OrderDetail } from '../orders/order.entity';
import { Review } from '../reviews/review.entity';
import { Cart, CartItem } from 'src/cart/cart.entity';
import { Wishlist } from 'src/wishlist/wishlist.entity';
import { Publisher } from 'src/publishers/entities/publisher.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Image } from 'src/products/entities/image.entity';
import { Feature } from 'src/products/entities/feature.entity';
import { Delivery } from '../delivery/delivery.entity';
import { Coupon } from '../coupons/coupon.entity';
import { TicketEarningLog } from '../minigame/ticket-earning-log.entity';
import { UserCoupon } from '../coupons/user-coupon.entity';

config();

const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        User, Product, Category, Order, OrderDetail, Review, Cart, Wishlist, Delivery, CartItem, Publisher, Tag, Image, Feature,
        Coupon, TicketEarningLog, UserCoupon
    ],
    synchronize: true
};

console.log('Data Source Options:', dataSourceOptions);

export default dataSourceOptions;