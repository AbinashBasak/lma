import {
  Controller,
  Get,
  Body,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post('user-details')
  create(@Body() createUserDto: CreateUserDto, @Request() req) {
    return this.userService.create(req.user, createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-details')
  findOne(@Request() req) {
    return this.userService.userDetails(req.user);
  }
}
