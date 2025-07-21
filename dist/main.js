"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("./auth/jwt-auth.guard");
const core_2 = require("@nestjs/core");
let cachedServer;
async function handler(req, res) {
    if (!cachedServer) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, { bodyParser: false });
        const reflector = app.get(core_2.Reflector);
        app.useGlobalGuards(new jwt_auth_guard_1.JwtAuthGuard(reflector));
        app.enableCors({
            origin: [
                'http://localhost:3000',
                'http://localhost:3001',
                'http://localhost:4000',
            ],
            credentials: true,
        });
        app.setGlobalPrefix('api');
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Swagger API')
            .setDescription('UI for API testing')
            .setVersion('1.0')
            .addTag('Playmaker')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        }, 'jwt')
            .build();
        const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('swagger-api', app, documentFactory);
        await app.init();
        cachedServer = app.getHttpServer();
    }
    cachedServer.emit('request', req, res);
}
//# sourceMappingURL=main.js.map