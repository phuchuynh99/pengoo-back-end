import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, LessThan, Between } from 'typeorm';
import { User } from '../users/user.entity';
import { CouponsService } from '../coupons/coupons.service';
import { TicketEarningLog, TicketEarningType } from './ticket-earning-log.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { randomBytes } from 'crypto';
import { UserCoupon } from '../coupons/user-coupon.entity';

@Injectable()
export class MinigameService {
  private readonly COUPON_POINT_THRESHOLD = 1000;
  private readonly MAX_TICKETS_PER_DAY = 3;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(TicketEarningLog)
    private ticketEarningLogRepository: Repository<TicketEarningLog>,
    private couponsService: CouponsService,
    @InjectRepository(UserCoupon)
    private userCouponRepo: Repository<UserCoupon>,
    private notificationsService: NotificationsService,
  ) {}

  async submitScore(userId: number, score: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['coupons'] });
    if (!user) throw new NotFoundException('User not found');

    if (user.minigame_tickets <= 0) {
      return { message: 'No tickets left. Earn more by interacting with posts, products, or social links.' };
    }

    user.minigame_tickets -= 1;
    user.points += score;
    await this.usersRepository.save(user);

    // After user qualifies for coupon:
    const activeCoupon = await this.couponsService.findActiveCoupon();
    if (!activeCoupon) return { message: 'No active coupons available.' };

    const hasCoupon = await this.userCouponRepo.findOne({
      where: { user: { id: userId }, coupon: { id: activeCoupon.id } }
    });

    if (user.points >= this.COUPON_POINT_THRESHOLD && !hasCoupon) {
      const redeemToken = randomBytes(32).toString('hex');
      const userCoupon = this.userCouponRepo.create({
        user,
        coupon: activeCoupon,
        redeemed: false,
        redeemToken,
      });
      await this.userCouponRepo.save(userCoupon);

      const redeemUrl = `https://your-frontend-domain.com/redeem-coupon?token=${redeemToken}`;
      await this.notificationsService.sendEmail(
        user.email,
        'Redeem your coupon!',
        `Congratulations! You earned a coupon. Click here to redeem: ${redeemUrl}`
      );

      return {
        message: `Congratulations! You earned a coupon. Check your email to redeem it.`,
        points: user.points,
        tickets: user.minigame_tickets,
      };
    }

    return { message: 'Score submitted', points: user.points, tickets: user.minigame_tickets };
  }

  async addTicket(userId: number, type: TicketEarningType, refId?: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Prevent duplicate for the same refId/type
    if (refId) {
      const existing = await this.ticketEarningLogRepository.findOne({
        where: { user: { id: userId }, type, refId },
      });
      if (existing) {
        return { message: 'You have already earned a ticket for this action.', tickets: user.minigame_tickets };
      }
    }

    // Limit per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const earnedToday = await this.ticketEarningLogRepository.count({
      where: {
        user: { id: userId },
        createdAt: Between(today, tomorrow),
      },
    });

    if (earnedToday >= this.MAX_TICKETS_PER_DAY) {
      return { message: 'You have reached your ticket earning limit for today.', tickets: user.minigame_tickets };
    }

    // Grant ticket and log the action
    user.minigame_tickets += 1;
    await this.usersRepository.save(user);

    const log = this.ticketEarningLogRepository.create({
      user,
      type,
      refId,
    });
    await this.ticketEarningLogRepository.save(log);

    return { message: 'Ticket earned!', tickets: user.minigame_tickets };
  }
}
