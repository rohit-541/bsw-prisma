import { CanActivate, ExecutionContext, Inject, Injectable,UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {

}

//AuthGaurd
export class AuthGaurd implements CanActivate{

    constructor(@Inject(JwtService) private readonly jwtService: JwtService,@Inject(PrismaService) private readonly databaseService: PrismaService
){}

    async canActivate(context: ExecutionContext):Promise<boolean>{
        const request = context.switchToHttp().getRequest();

        const token = request.headers['authorization'];
    
        if(!token){
            throw new UnauthorizedException("Invalid or missing token");
        }
        let payload = null;
        try {
            payload = await this.jwtService.verifyAsync(token,{
                secret:process.env.SECRET_KEY
            });
        } catch (error) {
            throw new UnauthorizedException("Token is Expired")
        }


        if(payload?.role === "admin"){
            request.role = "admin";
        }
        if(!payload.kerbros){
            throw new  UnauthorizedException("Not Allowed");
        }

        const result = await this.databaseService.user.findUnique({
            where:{
                kerbrosId:payload.kerbros,
                tokens:{
                    has:token
                }
            }
        });
     
        
        if(!result){
            throw new UnauthorizedException("Not Allowed");
        }
        
        request.role = result.role;
        request.user = result;
        return true;
    }
}

//AuthGaurd
export class MentorAuthGaurd implements CanActivate{

    constructor(@Inject(JwtService) private readonly jwtService: JwtService,private readonly databaseService: PrismaService
){}

    async canActivate(context: ExecutionContext):Promise<boolean>{
        const request = context.switchToHttp().getRequest();

        const token = request.headers['authorization'];

        if(!token){
            throw new UnauthorizedException("Invalid or missing token");
        }

        let payload = null;
        try {
            payload = await this.jwtService.verifyAsync(token,{
                secret:process.env.SECRET_KEY
            });
        } catch (error) {
            throw new UnauthorizedException("Token is Expired")
        }

        if(payload?.role === "admin"){
            return true;
        }

        const result = await this.databaseService.mentor.findUnique({
            where:{
                kerbros:payload.kerbros,
                tokens:{
                    has:token
                }
            }
        });


        if(!result){
            throw new UnauthorizedException("Not Allowed");
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
        const token = request.headers['authorization'];
        if(!token){
            throw new UnauthorizedException("Invalid or missing token");
        }
        
        let payload = null;
        try {
            payload = await this.jwtService.verifyAsync(token,{
                secret:process.env.SECRET_KEY
            });
        } catch (error) {
            throw new UnauthorizedException("Token is Expired")
        }

        if(payload.role == "admin"){
            return true;
        }

        //verify email exists
        const result = await this.databaseService.otps.findUnique({
            where:{
                email:payload.email+"@iitd.ac.in",
            }
        });

        if(!result){
            throw new UnauthorizedException("Unauthorized");
        }
        request.email = payload.email;
        return true;
    }
}

@Injectable()
export class AnyAuthGuard implements CanActivate {
  private guards: CanActivate[];

  constructor(private jwtService: JwtService, private prismaService: PrismaService) {
    // Initialize guards with necessary dependencies
    this.guards = [
      new MentorAuthGaurd(this.jwtService, this.prismaService),
      new AuthGaurd(this.jwtService, this.prismaService),
    ];
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    for (const guard of this.guards) {
      try {
        if (await guard.canActivate(context)) {
          return true; // If any guard passes, grant access
        }
      } catch (error) {
        // Continue to the next guard instead of failing immediately
      }
    }
    
    throw new UnauthorizedException('Unauthorized access: No valid authentication found.');
  }
}

