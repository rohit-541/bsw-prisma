import { Module } from '@nestjs/common';
import { DoubtsService } from './doubts.service';
import { DoubtsController } from './doubts.controller';
import { RepliesModule } from './replies/replies.module';

@Module({
  providers: [DoubtsService],
  controllers: [DoubtsController],
  imports: [RepliesModule]
})
export class DoubtsModule {}
