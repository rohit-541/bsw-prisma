import { Module } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { MentorController } from './mentor.controller';

@Module({
  imports:[],
  providers: [MentorService],
  controllers: [MentorController]
})
export class MentorModule {}
