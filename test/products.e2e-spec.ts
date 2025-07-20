import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Products (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/products (POST)', async () => {
    const res = await request(app.getHttpServer())
      .post('/products')
      .field('product_name', 'Sample Product')
      .field('description', 'A test product')
      .field('featured', JSON.stringify([{ title: 'Feature 1', content: 'Content 1', ord: 0 }]))
      .field('product_price', 100000)
      .field('discount', 0)
      .field('slug', 'sample-product')
      .field('meta_title', 'Sample Product')
      .field('meta_description', 'Meta description')
      .field('quantity_sold', 0)
      .field('quantity_stock', 100)
      .field('category_ID', 1)
      .field('publisher_ID', 1)
      .field('status', 'active')
      .field('tags', '1 2')
      .attach('mainImage', 'test/files/sample.jpg')
      .attach('detailImages', 'test/files/sample-detail.jpg')
      .attach('featureImages', 'test/files/sample.jpg'); // <-- Add this line
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  }, 20000); // 20 seconds

  afterAll(async () => {
    await app.close();
  });
});