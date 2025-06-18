import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

export enum TicketEarningType {
  POST = 'post',
  PRODUCT = 'product',
  SOCIAL = 'social',
}

@Entity()
export class TicketEarningLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.ticketEarningLogs)
  user: User;

  @Column({ type: 'enum', enum: TicketEarningType })
  type: TicketEarningType;

  @Column({ nullable: true })
  refId: string; // e.g., postId, productId, or social link id

  @CreateDateColumn()
  createdAt: Date;
}