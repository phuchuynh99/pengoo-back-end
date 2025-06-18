import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { MinigameService } from './minigame.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlayScratchDto } from './dto/play-scratch.dto';
import { SubmitScoreDto } from './dto/submit-score.dto';
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

  @UseGuards(JwtAuthGuard)
  @Post('play-scratch')
  async playScratch(@Req() req) {
    const userId = req.user.id;
    return this.minigameService.playScratch(userId);
  }
}
