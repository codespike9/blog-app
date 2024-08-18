import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {

    private s3:S3;

    constructor(private configService:ConfigService) {
        this.s3 = new S3({
            region: "ap-south-1",
            credentials: {
                accessKeyId: configService.get<string>('accessKeyId'),
                secretAccessKey: configService.get<string>('secretAccessKey')
            }
        })
    }

    async putObject (filename:string, contentType:string) {

        const command = new PutObjectCommand({
            Bucket: "blog-app.squbix",
            Key: `/upload/user-uploads/${filename}`,
            ContentType: contentType
        });
        const url= await getSignedUrl(this.s3,command);
        return url;
    }

    async getObjectURL(key:string){
        const command = new GetObjectCommand({
            Bucket: "blog-app.squbix",
            Key: `/upload/user-uploads/${key}`
        })
    
        const url = await getSignedUrl(this.s3,command)
        return url;
    }




}
