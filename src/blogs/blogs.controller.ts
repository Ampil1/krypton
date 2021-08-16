import { Body, Controller, Get, HttpStatus, Param, Post, Put, UseGuards, Query, Delete } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { LoginDTO, ResponseBadRequestMessage, ResponseErrorMessage, ResponseLogin, ResponseSuccessMessage, UpdateProfile, UserCreateDTO, UserRoles } from '../users/users.dto';
import { ApiBearerAuth, ApiImplicitQuery, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { GetUser } from 'src/utils/jwt.strategy';
import { CreateBlogsDto, UpdateBlogsDto } from './blogs.dto';
import { AuthGuard } from '@nestjs/passport';
@Controller('blogs')
@ApiUseTags('blogs')
export class BlogsController {
    constructor(
        private blogsService: BlogsService
    ) { }

    @Post('/create')
    @ApiOperation({ title: 'create Blogs' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async createBlog(@GetUser() user: UserCreateDTO, @Body() blogsdata: CreateBlogsDto): Promise<any> {
        try {
            if (user.role !== UserRoles.CONTENT_WRITER) return { response_code: HttpStatus.UNAUTHORIZED, response_data: "Sorry you are Note Allowed for this Api" }

            blogsdata.contentMangerId = user._id;
            const response = await this.blogsService.createBlogs(blogsdata);

            if (response) return { response_code: HttpStatus.OK, response_data: "Blogs Create Successfully" };
            else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
        }

    }

    /*in single Api we can manage update and published Api
    from front-end need to send body all update data and send only IsPublished key in true or false
     
    */
    @Put('/update/:blogsId')
    @ApiOperation({ title: 'udpate  Blogs or published' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async updateBlog(@GetUser() user: UserCreateDTO, @Param("blogsId") blogsId: string, @Body() blogsdata: UpdateBlogsDto): Promise<any> {
        try {
            if (user.role !== UserRoles.CONTENT_WRITER) return { response_code: HttpStatus.UNAUTHORIZED, response_data: "Sorry you are Note Allowed for this Api" }

            let blogFilter = { _id: blogsId }
            if (user.role === UserRoles.CONTENT_WRITER) blogFilter["contentMangerId"] = user._id;

            const getBlogsDetails = await this.blogsService.getblogsById(blogFilter);
            if (!getBlogsDetails) return { response_code: HttpStatus.BAD_REQUEST, response_data: "No Blogs list found" }
            blogsdata.contentMangerId = user._id;

            const response = await this.blogsService.updateBlogs(blogsId, blogsdata);
            if (response) return { response_code: HttpStatus.OK, response_data: "Blogs Updated Successfully" };
            else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
        }

    }

    @Get('/details/:blogsId')
    @ApiOperation({ title: 'Get details of blogs' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async getBlogDetails(@GetUser() user: UserCreateDTO, @Param("blogsId") blogsId: string, @Body() blogsdata: UpdateBlogsDto): Promise<any> {
        try {
            if (!(user.role === UserRoles.CONTENT_WRITER || user.role === UserRoles.ADMIN)) return { response_code: HttpStatus.UNAUTHORIZED, response_data: "Sorry you are Note Allowed for this Api" };

            let blogFilter = { _id: blogsId }
            if (user.role === UserRoles.CONTENT_WRITER) blogFilter["contentMangerId"] = user._id;

            const getBlogsDetails = await this.blogsService.getblogsById(blogFilter);

            if (!getBlogsDetails) return { response_code: HttpStatus.BAD_REQUEST, response_data: "No Blogs list found" }
            if (getBlogsDetails) return { response_code: HttpStatus.OK, response_data: getBlogsDetails };
            else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
        }

    }


    @Delete('/detele/:blogsId')
    @ApiOperation({ title: 'Get details of blogs' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async delteBlogDetails(@GetUser() user: UserCreateDTO, @Param("blogsId") blogsId: string): Promise<any> {
        try {

            if (!(user.role === UserRoles.CONTENT_WRITER || user.role === UserRoles.ADMIN)) return { response_code: HttpStatus.UNAUTHORIZED, response_data: "Sorry you are Note Allowed for this Api" }

            let blogFilter = { _id: blogsId }
            if (user.role === UserRoles.CONTENT_WRITER) blogFilter["contentMangerId"] = user._id;

            const getBlogsDetails = await this.blogsService.getblogsById(blogFilter);
            if (!getBlogsDetails) return { response_code: HttpStatus.BAD_REQUEST, response_data: "No Blogs list found" }

            const deleteData = await this.blogsService.deleteBlog(blogFilter)
            if (deleteData) return { response_code: HttpStatus.OK, response_data: "Blogs Deleted successfully" };
            else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
        }

    }

    @Get('/all/list')
    @ApiOperation({ title: 'Get details of blogs' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    public async getAllListBlogs(@GetUser() user: UserCreateDTO, @Query() page: number, @Query() limit: number): Promise<any> {
        try {
            if (!(user.role === UserRoles.CONTENT_WRITER || user.role === UserRoles.ADMIN)) return { response_code: HttpStatus.UNAUTHORIZED, response_data: "Sorry you are Note Allowed for this Api" }
            let blogfilter = {};
            if (user.role === UserRoles.CONTENT_WRITER) blogfilter['contentMangerId'] = user._id;

            const allList = await Promise.all([
                this.blogsService.getAllBlogsList(blogfilter),
                this.blogsService.countAllBlogsList(blogfilter),
            ])

            let resData = {
                data: allList[0],
                count: allList[1]
            }
            if (allList.length > 0) return { response_code: HttpStatus.OK, response_data: resData }
            else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
        }

    }

}
