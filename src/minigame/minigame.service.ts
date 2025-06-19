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

  private readonly SCRATCH_SYMBOLS = ['🍒', '⭐', '💎', '🍀', '🔔'];
  private readonly SCRATCH_GRID_SIZE = 3;

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

  async playScratch(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    if (user.minigame_tickets <= 0) {
      return { message: 'No tickets left. Earn more by interacting with posts, products, or social links.' };
    }

    // Deduct a ticket
    user.minigame_tickets -= 1;

    // Generate 3x3 grid with random tokens (symbols)
    const grid: string[][] = [];
    const tokens = this.SCRATCH_SYMBOLS;
    let gridScore = 0;
    let tileTokens: string[][] = [];
    for (let i = 0; i < this.SCRATCH_GRID_SIZE; i++) {
      grid[i] = [];
      tileTokens[i] = [];
      for (let j = 0; j < this.SCRATCH_GRID_SIZE; j++) {
        const token = tokens[Math.floor(Math.random() * tokens.length)];
        grid[i][j] = token;
        tileTokens[i][j] = token;
        gridScore += 50; // Each scratch awards 50 points (adjust as needed)
      }
    }

    // Check for 3-in-a-row and award bonus points
    const winLines = this.getWinningLines(tileTokens);
    let bonus = 0;
    if (winLines.length > 0) {
      bonus = winLines.length * 200; // 200 bonus points per line (adjust as needed)
      gridScore += bonus;
    }

    user.points += gridScore;

    // Coupon logic
    let couponGranted = false;
    let couponCode: string | null = null;
    const activeCoupon = await this.couponsService.findActiveCoupon();
    if (activeCoupon && user.points >= this.COUPON_POINT_THRESHOLD) {
      // Check if user already has this coupon
      const hasCoupon = await this.userCouponRepo.findOne({
        where: { user: { id: userId }, coupon: { id: activeCoupon.id } }
      });
      if (!hasCoupon) {
        const redeemToken = randomBytes(32).toString('hex');
        const userCoupon = this.userCouponRepo.create({
          user,
          coupon: activeCoupon,
          redeemed: false,
          redeemToken,
        });
        await this.userCouponRepo.save(userCoupon);
        couponGranted = true;
        couponCode = activeCoupon.code;
        // Optionally, send notification/email here
      }
    }

    await this.usersRepository.save(user);

    return {
      grid,
      tileTokens,
      winLines,
      bonus,
      gridScore,
      totalPoints: user.points,
      tickets: user.minigame_tickets,
      couponGranted,
      couponCode,
      message: couponGranted
        ? `Congrats! You earned a coupon: ${couponCode}`
        : winLines.length > 0
          ? `Bonus! ${bonus} points for ${winLines.length} line(s)!`
          : `You earned ${gridScore} points!`
    };
  }

  async claimDailyFreeTicket(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If never claimed or last claim was before today, allow claim
    if (!user.lastFreeTicketClaim || user.lastFreeTicketClaim.getTime() < today.getTime()) {
      user.minigame_tickets += 1;
      user.lastFreeTicketClaim = today;
      await this.usersRepository.save(user);
      return { message: 'Bạn đã nhận vé miễn phí hôm nay!', tickets: user.minigame_tickets };
    } else {
      return { message: 'Bạn đã nhận vé miễn phí hôm nay rồi. Hãy quay lại vào ngày mai!', tickets: user.minigame_tickets };
    }
  }

  // Helper to check for winning lines (returns array of winning line types)
  private getWinningLines(grid: string[][]): string[] {
    const size = grid.length;
    const lines: string[] = [];

    // Rows
    for (let i = 0; i < size; i++) {
      if (grid[i][0] && grid[i].every(cell => cell === grid[i][0])) {
        lines.push(`row${i + 1}`);
      }
    }
    // Columns
    for (let i = 0; i < size; i++) {
      if (grid[0][i] && grid.every(row => row[i] === grid[0][i])) {
        lines.push(`col${i + 1}`);
      }
    }
    // Diagonal TL-BR
    if (grid[0][0] && grid.every((row, idx) => row[idx] === grid[0][0])) {
      lines.push('diag1');
    }
    // Diagonal TR-BL
    if (grid[0][size - 1] && grid.every((row, idx) => row[size - 1 - idx] === grid[0][size - 1])) {
      lines.push('diag2');
    }
    return lines;
  }
}
