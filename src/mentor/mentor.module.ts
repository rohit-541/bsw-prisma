import { Module } from '@nestjs/common';
import { MentorService } from './mentor.service';
import { MentorController } from './mentor.controller';
import { MailService } from 'src/mail/mail.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'PrismaService';

@Module({
  imports:[],
  providers: [MentorService,MailService,PrismaService],
  controllers: [MentorController]
})
export class MentorModule {}
