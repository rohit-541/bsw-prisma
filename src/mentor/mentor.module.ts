import { Module } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { MentorController } from './mentor.controller';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports:[],
  providers: [MentorService,MailService],
  controllers: [MentorController]
})
export class MentorModule {}
