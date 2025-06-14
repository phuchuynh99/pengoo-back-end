export class CreateDeliveryDto {
  name: string;
  description?: string;
  fee?: number;
  estimatedTime?: string;
  isAvailable?: boolean;
}