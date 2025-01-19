import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

}

//AuthGaurd
export class AuthGaurd implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        return true;
    }
}

//Email Verification

//Role Gaurd
