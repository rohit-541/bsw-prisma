import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DoubtsModule } from './doubts/doubts.module';
import { MentorModule } from './mentor/mentor.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { MailModule } from './mail/mail.module';
import { PrismaService } from 'PrismaService';

@Module({
  imports: [UserModule, DoubtsModule, MentorModule, AuthModule, SessionsModule,JwtModule.register({
    global:true,
    secret:process.env.SECRET_KEY||"yourkey"
  }),PrismaModule,MailModule],
  controllers: [AppController],
  providers: [AppService,PrismaService],
})
export class AppModule {}
