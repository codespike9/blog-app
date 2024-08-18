import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { BlogDto } from './dto';
import { BlogService } from './blog.service';
import { AuthenticatedRequest } from 'src/interfaces/authenticated-request.interface';
import { S3Service } from 'src/s3/s3.service';

@Controller('blog')
export class BlogController {

    constructor(private blogService:BlogService,private s3Service:S3Service) {}

    @Post('create-post')
    async createPost(@Body() dto:BlogDto,@Req() req: AuthenticatedRequest) {
        dto.author=req.user.userId;
        console.log(req.user);
        return await this.blogService.createPost(dto);
    }

    @Get('read-post/:id')
    async readPost(@Param('id') id:string) {
        return await this.blogService.readPost(id);
    }


    @Get('my-posts')
    async readAllPosts(@Req() req: AuthenticatedRequest) {
        console.log(req.user.userId)
        return await this.blogService.readAllPost(req.user.userId);
    }

    @Get('all-posts')
    async readPosts() {
        return await this.blogService.readPosts();
    }

    @Put('update-post/:id')
    async updatePost(@Param('id') id:string, @Body() data:{ content:string }) {
        const { content }=data;
        if(!content)
            throw Error("content is missing.")
        return await this.blogService.updatePost(id,content);
    }

    @Delete('delete-post/:id')
    async deletePost(@Param('id') id:string) {
        return await this.blogService.deletePost(id);
    }

    @Get('upload-photo/:id')
    async getPreSignedUrl(@Param('id') id:string) {
        return await this.blogService.getPreSignedUrl(id);
    }
}
