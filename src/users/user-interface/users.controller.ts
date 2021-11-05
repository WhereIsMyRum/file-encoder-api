import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards';
import {
  CreateUserDto,
  UserDto,
  UserCreatedDto,
  UserManagementService,
} from '../application';

@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(private readonly userService: UserManagementService) {}

  @ApiResponse({
    status: 201,
    type: UserCreatedDto,
    description: 'Returns a newly created id',
  })
  @Post('/register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ id: string }> {
    const id = await this.userService.createUser(createUserDto);

    return { id };
  }

  @ApiBearerAuth('Bearer token')
  @ApiResponse({
    status: 200,
    type: UserDto,
    description: 'Returns a user by id',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/users/:id')
  async getUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.getUser(id);
  }

  @ApiBearerAuth('Bearer token')
  @ApiResponse({
    status: 200,
    type: [UserDto],
    description: 'Returns a user by id',
  })
  @UseGuards(JwtAuthGuard)
  @Get('/users')
  async getUsers(): Promise<UserDto[]> {
    return this.userService.getAllUsers();
  }
}
