import { BadRequestException, CanActivate, ExecutionContext, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'PrismaService';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

}

//AuthGaurd
export class AuthGaurd implements CanActivate{

    constructor(@Inject(JwtService) private readonly jwtService: JwtService,@Inject(PrismaService) private readonly databaseService: PrismaService
){}

    async canActivate(context: ExecutionContext):Promise<boolean>{
        const request = context.switchToHttp().getRequest();

        const token = request.cookies['loginToken'];
        if(!token){
            throw new UnauthorizedException("Invalid or missing token");
        }

        const payload = await this.jwtService.verifyAsync(token,{
            secret:process.env.SECRET_KEY
        });

        const result = await this.databaseService.user.findUnique({
            where:{
                kerbrosId:payload.kerbros,
                tokens:{
                    has:token
                }
            }
        });

        if(!result){
            throw new NotFoundException("User not found");
        }
        
        request.user = result;

        return true;
    }
}

//Email Verification
export class emailGaurd implements CanActivate{
    constructor(@Inject(JwtService) private readonly jwtService: JwtService,@Inject(PrismaService) private readonly databaseService: PrismaService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.cookies['token'];
        if(!token){
            throw new UnauthorizedException("Invalid or missing token");
        }
        const payload = this.jwtService.verify(token,{
            secret:process.env.SECRET_KEY
        })
        
        //verify email exists
        const result = await this.databaseService.otps.findUnique({
            where:{
                email:payload.email+"@iitd.ac.in"
            }
        });

        if(!result){
            throw new UnauthorizedException("Unauthorized");
        }
        request.email = payload.email;
        return true;
    }
}

//Role Gaurd
