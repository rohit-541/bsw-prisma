import { Module } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { MentorController } from './mentor.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports:[MulterModule.register({
    dest:'../public/uploads'
  })],
  providers: [MentorService],
  controllers: [MentorController]
})
export class MentorModule {}
