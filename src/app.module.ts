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
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [ConfigModule.forRoot(),UserModule, DoubtsModule, MentorModule, AuthModule, SessionsModule,JwtModule.register({
    global:true,
    secret:process.env.SECRET_KEY||"yourkey",
    signOptions:{
      expiresIn:'24h'
    }
  }),MulterModule.register({
    dest:'/public/uploads'
  }),PrismaModule,MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
