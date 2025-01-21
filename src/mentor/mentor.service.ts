import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MentorService {

    constructor(@Inject()private readonly prisma:PrismaService){}

    //create mentor
    async createMentor(data:any){
        // const result = await
    }
    //update mentor

    //delete mentor

    //update mentor

    //add time for mentor

}
