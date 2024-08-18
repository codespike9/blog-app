import { Injectable, ForbiddenException } from '@nestjs/common';
import { AuthDto, SignUpDto } from './dto';
import { MongodbService } from 'src/mongodb/mongodb.service';
import { Db, MongoError } from 'mongodb';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {

    db:Db
    readonly secretKey:string ;
    private readonly expiresIn = '1h';
    constructor(private readonly mongodbService:MongodbService,private config:ConfigService) {
        this.db=mongodbService.getDb();
        this.secretKey=this.config.get<string>('SECRET_KEY')
    }

    async signup (dto: SignUpDto) {

        var user= await this.mongodbService.findOne('users',{email:dto.email});
        if(user)
            throw Error("Email is already registered.")

        const hash= await argon.hash(dto.password);
        dto.password=hash;

        try {
            const user= await this.mongodbService.runWithTransaction(async (session)=>{
                return this.mongodbService.insertOne('users', dto, session);
            });
            return user;
        } catch (error) {
            if (error instanceof MongoError) {
                if (error.code === 11000) {
                    throw new ForbiddenException('Email is already registered.');
                }
            }
            throw error;
        }
    }

    async login(dto:AuthDto) {

        console.log(dto.email)
        const user = await this.mongodbService.findOne('users',{email:dto.email});
        console.log(user)
        if(!user) throw new ForbiddenException('Invalid credentials.');

        const passMatches= await argon.verify(user.password,dto.password);

        if(!passMatches) throw new ForbiddenException('Invalid credentials.');

        const token=this.generateToken({email:dto.email,userId:user._id});
        return {"access_token":token};
    }

    generateToken(payload: object): string {
        return jwt.sign(payload,this.secretKey,{expiresIn:this.expiresIn});
    }

    verifyToken(token:string):any{
        try {
            const decoded = jwt.verify(token, this.secretKey);
            return decoded;
        } catch (error) {
            return null;
        }
    }
}
