import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinigameService } from './minigame.service';
import { MinigameController } from './minigame.controller';
import { User } from '../users/user.entity';
import { CouponsModule } from '../coupons/coupons.module';
import { TicketEarningLog } from './ticket-earning-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, TicketEarningLog]), CouponsModule],
  providers: [MinigameService],
  controllers: [MinigameController],
})
export class MinigameModule {}
