import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { Server } from 'http';

let cachedServer: Server;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:4000',
      'https://pengoo-back-end.vercel.app', // <-- Add Vercel frontend origin
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

  await app.listen(process.env.PORT ?? 3000);

  console.log("-------------------------------------------");
  console.log("---| http://localhost:3000/swagger-api |---")
  console.log("-------------------------------------------");
}

// Vercel handler: allow direct access to /swagger-api
export default async function handler(req, res) {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule, { bodyParser: false });
    await app.init();
    cachedServer = app.getHttpServer();
  }
  // If request is for /swagger-api, serve it directly
  if (req.url.startsWith('/swagger-api')) {
    cachedServer.emit('request', req, res);
    return;
  }
  // Otherwise, route to /api
  cachedServer.emit('request', req, res);
}

bootstrap();
