import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogsSchema } from './blogs.schema';

@Module({

  imports: [
		MongooseModule.forFeature([{ name: 'Blogs', schema: BlogsSchema }]),
	],
  providers: [BlogsService],
  controllers: [BlogsController]
})
export class BlogsModule {}
