import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { PushModule } from './push/push.module';

@Module({
  imports: [PushModule],
})
class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3002);
  console.log('NestJS Server running on http://localhost:3002');
}
bootstrap();
