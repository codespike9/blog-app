import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class BlogDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsString()
    author?: string;
}
