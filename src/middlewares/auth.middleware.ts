import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(private authService:AuthService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const token = req.headers.authorization?.split(' ')[1];

        if(token){
            const decoded= this.authService.verifyToken(token);
            if(decoded){
                req['user']=decoded;
            } else {
                return res.status(401).json({ message: 'Invalid or expired token' });
            }
        } else {
            return res.status(401).json({ message: 'Token not provided' });
          }

        next();
    }
}