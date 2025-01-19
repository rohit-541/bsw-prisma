import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { DoubtsModule } from './doubts/doubts.module';
import { MentorModule } from './mentor/mentor.module';
import { AuthModule } from './auth/auth.module';
import { MailService } from 'Mail/SendMail';

@Module({
  imports: [UserModule, DoubtsModule, MentorModule, AuthModule],
  controllers: [AppController, UserController],
  providers: [AppService,MailService],
})
export class AppModule {}
