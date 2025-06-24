import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { MinigameService } from './minigame.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlayScratchDto } from './dto/play-scratch.dto';
import { SubmitScoreDto } from './dto/submit-score.dto';
import { TicketEarningType } from './ticket-earning-log.entity';
import { ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Minigame')
@Controller('minigame')
export class MinigameController {
  constructor(private readonly minigameService: MinigameService) {}

  @UseGuards(JwtAuthGuard)
  @Post('submit-score')
  @ApiOperation({ summary: 'Submit a minigame score and consume a ticket' })
  @ApiBody({
    type: SubmitScoreDto,
    examples: {
      default: {
        summary: 'Submit score',
        value: { score: 150 },
      },
    },
  })
  async submitScore(@Req() req, @Body() dto: SubmitScoreDto) {
    const userId = req.user.id;
    return this.minigameService.submitScore(userId, dto.score);
  }

  @UseGuards(JwtAuthGuard)
  @Post('earn-ticket')
  @ApiOperation({ summary: 'Earn a minigame ticket by action' })
  @ApiBody({
    schema: {
      example: {
        type: 'post', // or 'product', 'social'
        refId: '123', // optional, e.g., postId or productId
      },
    },
    description: 'Type: post, product, or social. refId is optional.',
  })
  async earnTicket(@Req() req, @Body() body: { type: TicketEarningType, refId?: string }) {
    const userId = req.user.id;
    return this.minigameService.addTicket(userId, body.type, body.refId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('play-scratch')
  @ApiOperation({ summary: 'Play the scratch minigame (consumes a ticket)' })
  async playScratch(@Req() req) {
    const userId = req.user.id;
    return this.minigameService.playScratch(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('claim-daily-ticket')
  @ApiOperation({ summary: 'Claim your daily free minigame ticket' })
  async claimDailyTicket(@Req() req) {
    return this.minigameService.claimDailyFreeTicket(req.user.id);
  }
}