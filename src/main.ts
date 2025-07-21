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
      'http://localhost:3000', // <-- Add this line for Swagger UI
      'http://localhost:3001', // main site
      'http://localhost:4000', // admin dashboard
    ],
    credentials: true,
  });

  app.setGlobalPrefix('api'); // <--- Add this line

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
      'jwt', // this name is used later in @ApiBearerAuth('jwt')
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger-api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);

  console.log("-------------------------------------------");
  console.log("---| http://localhost:3000/swagger-api |---")
  console.log("-------------------------------------------");

}

export default async function handler(req, res) {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule, { bodyParser: false });
    await app.init();
    cachedServer = app.getHttpServer();
  }
  cachedServer.emit('request', req, res);
}

bootstrap();
