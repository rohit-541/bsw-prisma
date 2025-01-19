import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from 'PrismaService';
import { MailService } from 'Mail/SendMail';

@Module({
  controllers: [UserController],
  providers: [UserService,PrismaService,MailService]
})
export class UserModule {}
