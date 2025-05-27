import { config } from 'dotenv';
import { Category } from '../categories/category.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { DataSourceOptions } from 'typeorm';

config();

const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Product, Category],
    synchronize: true
};

console.log('Data Source Options:', dataSourceOptions);

export default dataSourceOptions;