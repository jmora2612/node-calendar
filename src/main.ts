import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
const port = process.env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  // Configuración de Swagger para "auth"
  const authOptions = new DocumentBuilder()
    .setTitle('Calendar')
    .setDescription('API for the Calendar')
    .setVersion('1.0')
    .addTag('Calendar')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-authenticate',
    )
    .build();
  const authDocument = SwaggerModule.createDocument(app, authOptions);
  SwaggerModule.setup('calendar-api', app, authDocument);

  await app.listen(port);
}

bootstrap();
