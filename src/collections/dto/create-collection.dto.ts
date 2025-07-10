export class CreateCollectionDto {
  name: string;
  slug: string;
  image_url?: string;
  productIds?: number[];
}