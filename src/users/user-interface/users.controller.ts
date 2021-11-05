import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards';
import { CreateUserDto, UserDto, UserManagementService } from '../application';

@ApiTags('users')
@Controller()
export class UsersController {
  constructor(private readonly userService: UserManagementService) {}

  @Post('/register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ _id: string }> {
    const _id = await this.userService.createUser(createUserDto);

    return { _id };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users/:id')
  async getUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.getUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/users')
  async getUsers(): Promise<UserDto[]> {
    return this.userService.getAllUsers();
  }
}
