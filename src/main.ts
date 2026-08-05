import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('E-commerce APIs')
    .setDescription('The e-commerce API description')
    .setVersion('1.0')
    .addTag('e-commerce')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // Start the server
  await app.listen(process.env.PORT ?? 3000);
  console.log('Server is running on port', process.env.PORT ?? 3000);
}
bootstrap();
