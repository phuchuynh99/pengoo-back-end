import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { Server } from 'http';

let cachedServer: Server;

export default async function handler(req, res) {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule, { bodyParser: false });
    const reflector = app.get(Reflector);
    app.useGlobalGuards(new JwtAuthGuard(reflector));

    app.enableCors({
      origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:4000',
      ],
      credentials: true,
    });

    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
      .setTitle('Swagger API')
      .setDescription('UI for API testing')
      .setVersion('1.0')
      .addTag('Playmaker')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        'jwt',
      )
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger-api', app, documentFactory);

    await app.init();
    cachedServer = app.getHttpServer();
  }
  cachedServer.emit('request', req, res);
}
