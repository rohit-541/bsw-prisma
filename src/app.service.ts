import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This is Backend Portal for Aceadmic MentorShip. This is Currently working frontend is pending to host which we will host soon! please stay updated';
  }
}
