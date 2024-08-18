import { Injectable } from '@nestjs/common';
import { MongodbService } from 'src/mongodb/mongodb.service';
import { BlogDto } from './dto';
import { ObjectId } from 'mongodb';
import { S3Service } from 'src/s3/s3.service';

@Injectable()
export class BlogService {

    constructor (private mongodbService:MongodbService, private s3Service:S3Service) {}

    async createPost(dto: BlogDto):Promise<object>{

        return await this.mongodbService.runWithTransaction(async (session)=>{
            return await this.mongodbService.insertOne('posts', dto, session)
        })
    }

    async readPost(id:string) {
        const post=await this.mongodbService.findOne("posts",{_id:new ObjectId(id)});
        post.authorName=await this.mongodbService.findOne("users",{_id:new ObjectId(post.author)},{firstName:1,lastName:1,_id:0});
        if((post.pictures).length!==0){
            post.picture = await Promise.all(post.pictures.map(async (picture:any)=>{
                return await this.s3Service.getObjectURL(picture)
            }));
        }
        return post;
    }

    async readAllPost(userId:string) {
        let posts=await this.mongodbService.find("posts",{author:userId});
        posts= await Promise.all(posts.map(async (post)=>{
            post.authorName=await this.mongodbService.findOne("users",{_id:new ObjectId(post.author)},{firstName:1,lastName:1,_id:0});
            return post;
        }));
        return posts;
    }

    async readPosts() {
        let posts=await this.mongodbService.find("posts",{});
        posts= await Promise.all(posts.map(async (post)=>{
            post.authorName=await this.mongodbService.findOne("users",{_id:new ObjectId(post.author)},{firstName:1,lastName:1,_id:0});
            return post;
        }));
        return posts;
    }

    async updatePost(id:string, content:string) {
        return await this.mongodbService.runWithTransaction(async (session)=>{
            return await this.mongodbService.updateOne("posts",{_id:new ObjectId(id)},{$set:{content:content}},session);            
        })
    }

    async deletePost(id:string) {
        return await this.mongodbService.deleteOne("posts",{_id:new ObjectId(id)});
    }

    async getPreSignedUrl(id: string) {
        const image=`image-${Date.now()}.jpeg`;
        await this.mongodbService.updateOne("posts",{_id:new ObjectId(id)},{$push : {pictures:image}})
        return await this.s3Service.putObject(image,'image/jpeg');
    }

}
