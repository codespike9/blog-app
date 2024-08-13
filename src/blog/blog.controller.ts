import { Controller, Get } from '@nestjs/common';

@Controller('blog')
export class BlogController {

    @Get('/')
    test(){
        return " Hii from blog"
    }
}
