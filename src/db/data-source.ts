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
import { Featured } from 'src/products/entities/featured.entity';
import { Delivery } from '../delivery/delivery.entity';
import { Coupon } from '../coupons/coupon.entity';
import { TicketEarningLog } from '../minigame/ticket-earning-log.entity';
import { UserCoupon } from '../coupons/user-coupon.entity';
import { Post } from '../posts/posts.entity';
import { PostCatalogue } from '../posts/post-catalogue.entity';
import { Admin } from '../admins/admin.entity';
import { Role } from '../roles/role.entity';
import { RolePermission } from '../roles/role-permission.entity';
import { Permission } from '../roles/permission.entity';
import { Collection } from '../collections/collection.entity';

config();

const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
        User, Product, Category, Order, OrderDetail, Review, Cart, Wishlist, Delivery, CartItem, Publisher, Tag, Image, Featured,
        Coupon, TicketEarningLog, UserCoupon,
        Admin, Post, PostCatalogue,
        Role, RolePermission, Permission,
        Collection
    ],
    synchronize: true
};

console.log('Data Source Options:', dataSourceOptions);

export default dataSourceOptions;