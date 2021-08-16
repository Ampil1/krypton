import { Body, Controller, Get, HttpStatus, Param, Post, Put, UseGuards ,Query, Delete} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiImplicitQuery, ApiOperation, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { AuthService } from 'src/utils/auth.service';
import { GetUser } from 'src/utils/jwt.strategy';
import { AdminQuery, LoginDTO, ResponseBadRequestMessage, ResponseErrorMessage, ResponseLogin, ResponseSuccessMessage, UpdateProfile, UserCreateDTO, UserRoles } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiUseTags('users')
export class UsersController {
	constructor(
		private userService: UsersService,
		private authService: AuthService,
	) { }

	//USER REGISTRATION API
	@Post('admin/add/content-manager')
	@ApiOperation({ title: 'Register content-manager' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	public async registerNewUser(@GetUser() users: UserCreateDTO, @Body() userData: UserCreateDTO): Promise<any> {
		try {

			if (users.role !== UserRoles.ADMIN) return { response_code: HttpStatus.UNAUTHORIZED, response_data: "Sorry you are Note Allowed for this Api" }

			const checkUser = await this.userService.getUserByEmail(userData.email);
			if (checkUser && checkUser.email == userData.email) return { response_code: HttpStatus.BAD_REQUEST, response_data: "User email already exist" };
			userData.role = UserRoles.CONTENT_WRITER;
			const user = await this.userService.createUser(userData);
			if (user) return { response_code: HttpStatus.OK, response_data: "User Registered successfully" };
			else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
		} catch (e) {
			return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
		}
	}
	// USER LOGIN API
	@Post('/login')
	@ApiOperation({ title: 'Log in user' })
	@ApiResponse({ status: 200, description: 'Return user info', type: ResponseLogin })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	public async validateUser(@Body() credentials: LoginDTO): Promise<any> {
		try {

			let user
			user = await this.userService.getUserByEmail(credentials.email);
			if (!user) return { response_code: HttpStatus.BAD_REQUEST, response_data: "user Email not found" }

			if (user.status) return { response_code: HttpStatus.BAD_REQUEST, response_data: "Your are already login please make-sure logout from all devices" }

			const isValid = await this.authService.verifyPassword(credentials.password, user.password);
			if (!isValid) return { response_code: HttpStatus.BAD_REQUEST, response_data: "Enter valid Credentails" }
			const token = await this.authService.generateAccessToken(user._id, user.role);
			return ({ token: token, role: user.role, id: user._id, language: user.language, isSuperAdmin: user.isSuperAdmin });

		} catch (e) {
			return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
		}
	}

	@Get('/me/profile')
	@ApiOperation({ title: 'Get profile' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	public async meProfile(@GetUser() user: UserCreateDTO): Promise<any> {
		try {
			const response = await this.userService.getUserById(user._id,);
			if (response) return { response_code: HttpStatus.OK, response_data: response };
			else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
		} catch (e) {
			return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
		}
	}

	@Put('/update/profile')
	@ApiOperation({ title: 'Get profile' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	public async updateProfile(@GetUser() user: UserCreateDTO, @Body() data: UpdateProfile): Promise<any> {
		try {
			const response = await this.userService.updateProfile(user._id, data);
			if (response) return { response_code: HttpStatus.OK, response_data: "profile update successfully" };
			else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
		} catch (e) {
			return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
		}
	}

	@Get('/admin/manger-profile/:Id')
	@ApiOperation({ title: 'Get profile' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	public async getById(@GetUser() users: UserCreateDTO, @Param('Id') Id: string): Promise<any> {
		try {
			if (users.role !== UserRoles.ADMIN) return { response_code: HttpStatus.UNAUTHORIZED, response_data: "Sorry you are Note Allowed for this Api" }

			const response = await this.userService.getById(Id);
			if(!response)  return { response_code: HttpStatus.BAD_REQUEST, response_data: "Data not found" }
			if (response) return { response_code: HttpStatus.OK, response_data: response };
			else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
		} catch (e) {
			return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
		}
	}
    
	@Get('/admin/all/list')
	@ApiOperation({ title: 'Get All list' })
	@ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
	@ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
	@ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
	public async AllList(@GetUser() users: UserCreateDTO, @Query()query:AdminQuery): Promise<any> {
		try {
			if (users.role !== UserRoles.ADMIN) return { response_code: HttpStatus.UNAUTHORIZED, response_data: "Sorry you are Note Allowed for this Api" }
	        const allList = await Promise.all([ 
				this.userService.getAllList(),
				this.userService.CountAllList(),
			])
			let res = {
				data:allList[0],
				count: allList[1]
			}
			if (allList.length) return { response_code: HttpStatus.OK, response_data: res };
			else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
		} catch (e) {
			return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
		}
	}

	@Delete('/details/:userId')
    @ApiOperation({ title: 'Get details of blogs' })
    @ApiResponse({ status: 200, description: 'Success message', type: ResponseSuccessMessage })
    @ApiResponse({ status: 400, description: 'Bad request message', type: ResponseBadRequestMessage })
    @ApiResponse({ status: 404, description: 'Unauthorized or Not found', type: ResponseErrorMessage })
	@UseGuards(AuthGuard('jwt'))
	@ApiBearerAuth()
    public async delteBlogDetails(@GetUser() user: UserCreateDTO, @Param("userId") userId: string): Promise<any> {
        try {
            
            if ( user.role !== UserRoles.ADMIN) return { response_code: HttpStatus.UNAUTHORIZED, response_data: "Sorry you are Note Allowed for this Api" }
            const deleteData = await this.userService.deleteById(userId);
            if (deleteData) return { response_code: HttpStatus.OK, response_data: "Content-manger Deleted successfully" };
            else return { response_code: HttpStatus.BAD_REQUEST, response_data: "something went wrong" }
        } catch (e) {
            return { response_code: HttpStatus.INTERNAL_SERVER_ERROR, response_data: e.message }
        }

    }

}
