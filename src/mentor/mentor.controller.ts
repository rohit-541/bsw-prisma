import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { mentorDTO } from './mentor.validation';

@Controller('mentor')
export class MentorController {
    //create mentor
    @Post()
    async createMentor(@Body(new ValidationPipe({whitelist:true})) data:mentorDTO){
        
    }
    //update mentor

    //delete mentor

    //update mentor

    //add time for mentor
}
