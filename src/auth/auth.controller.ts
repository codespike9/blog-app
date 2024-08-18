import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, SignUpDto } from './dto';

@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService) {}

    @Post('signup')
    async signup(@Body() dto:SignUpDto){
        return await this.authService.signup(dto)
    }

    @Post('login')
    async login(@Body() dto:AuthDto) {
        return await this.authService.login(dto);

    }
}
