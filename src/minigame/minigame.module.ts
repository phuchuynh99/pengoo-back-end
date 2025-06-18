import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinigameService } from './minigame.service';
import { MinigameController } from './minigame.controller';
import { User } from '../users/user.entity';
import { CouponsModule } from '../coupons/coupons.module';
import { TicketEarningLog } from './ticket-earning-log.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { Coupon } from '../coupons/coupon.entity';
import { UserCoupon } from '../coupons/user-coupon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, TicketEarningLog, Coupon, UserCoupon]),
    CouponsModule,
    NotificationsModule,
  ],
  providers: [MinigameService],
  controllers: [MinigameController],
})
export class MinigameModule {}
