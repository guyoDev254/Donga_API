import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'buffer';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createUserDto: CreateUserDto, @UploadedFile() file: File) {
    const imageUrl = file ? await this.uploadToCloudStorage(file) : null;
    return this.usersService.create({ ...createUserDto, image: imageUrl });
  }

  private async uploadToCloudStorage(file): Promise<string> {
    return '/Users/guyoabdub/Projects/DONGA/donga-api/uploads/' + file.originalname;
  }

  @Get()
  // @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Post('verify')
  verifyUserOtp(@Body() body: {email: string, otp: string}) {
    return this.usersService.verifyUserOtp(body.email, body.otp)
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  // @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Delete()
  // @UseGuards(JwtAuthGuard)
  removeAll() {
    return this.usersService.removeAll()
  }
}
