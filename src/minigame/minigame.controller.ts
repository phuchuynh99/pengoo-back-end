import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { MinigameService } from './minigame.service';
import { SubmitScoreDto } from './dto/submit-score.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TicketEarningType } from './ticket-earning-log.entity';

@Controller('minigame')
export class MinigameController {
  constructor(private readonly minigameService: MinigameService) {}

  @UseGuards(JwtAuthGuard)
  @Post('submit-score')
  async submitScore(@Req() req, @Body() dto: SubmitScoreDto) {
    const userId = req.user.id;
    return this.minigameService.submitScore(userId, dto.score);
  }

  @UseGuards(JwtAuthGuard)
  @Post('earn-ticket')
  async earnTicket(@Req() req, @Body() body: { type: TicketEarningType, refId?: string }) {
    const userId = req.user.id;
    return this.minigameService.addTicket(userId, body.type, body.refId);
  }
}
