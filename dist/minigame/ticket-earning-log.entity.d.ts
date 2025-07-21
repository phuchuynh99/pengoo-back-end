import { User } from '../users/user.entity';
export declare enum TicketEarningType {
    POST = "post",
    PRODUCT = "product",
    SOCIAL = "social"
}
export declare class TicketEarningLog {
    id: number;
    user: User;
    type: TicketEarningType;
    refId: string;
    createdAt: Date;
}
