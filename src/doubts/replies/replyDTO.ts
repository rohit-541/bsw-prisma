import { IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class replyDTO{
    //replyText
    @IsNotEmpty()
    @IsString()
    replyText:String
    
    //doubtId    
    @IsString()
    @IsNotEmpty()
    doubtId:string
}

export class updateReplyDto{
    @IsOptional()
    @IsString()
    replyText:string
}

export class doubtId{
    @IsNotEmpty()
    @IsString()
    doubtId:string
}