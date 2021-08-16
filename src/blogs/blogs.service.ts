import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBlogsDto, UpdateBlogsDto } from './blogs.dto';

@Injectable()
export class BlogsService {
    constructor(
        @InjectModel('Blogs') private blogsModel: Model<any>,
    ) { }

    // create Blogs
    public async createBlogs(blogsData: CreateBlogsDto): Promise<any> {
        return await this.blogsModel.create(blogsData);
    }

    // update blogs
    public async updateBlogs(blogfilter: string, blogsData: UpdateBlogsDto): Promise<any> {
        return await this.blogsModel.findByIdAndUpdate(blogfilter, blogsData);
    }
    public async getblogsById(blogFilter: any): Promise<any> {
        return await this.blogsModel.findOne(blogFilter);
    }

    public async deleteBlog(blogFilter: any): Promise<any> {
        return await this.blogsModel.findOneAndDelete(blogFilter);
    }

    public async getAllBlogsList( blogFilter: any): Promise<any> {
        return await this.blogsModel.find(blogFilter).sort({ createdAt: 1 });
    }
    public async countAllBlogsList(blogFilter: any): Promise<any> {
        return await this.blogsModel.countDocuments(blogFilter);
    }
}
