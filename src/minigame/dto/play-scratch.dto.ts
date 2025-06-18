import { ApiProperty } from '@nestjs/swagger';

export class PlayScratchDto {
  @ApiProperty({ example: 1, description: 'User ID (optional if using JWT)' })
  userId?: number;
}