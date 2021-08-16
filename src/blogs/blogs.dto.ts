import { ApiModelProperty } from "@nestjs/swagger";
import { IsNotEmpty, isNotEmpty, IsOptional } from "class-validator";

export class CreateBlogsDto {

    @ApiModelProperty()
    @IsNotEmpty()
    title: string;

    @ApiModelProperty()
    @IsNotEmpty()
    description: string;

    @ApiModelProperty()
    @IsOptional()
    images: {}
    
    @ApiModelProperty()
    @IsOptional()
    isPublish: boolean
    contentMangerId?: string
}


export class UpdateBlogsDto {

    @ApiModelProperty()
    @IsOptional()
    title: string;

    @ApiModelProperty()
    @IsOptional()
    description: string;

    @ApiModelProperty()
    @IsOptional()
    images: {}
    
    @ApiModelProperty()
    @IsOptional()
    isPublish: boolean
    contentMangerId?: string
}