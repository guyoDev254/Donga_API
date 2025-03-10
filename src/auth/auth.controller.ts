import { Body, Controller, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() { email, password }: LoginDto) {
    return this.authService.login(email, password);
  }

  @Patch('change-password')
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }

  @Post('forget-password')
  forgetPassword(@Body() { email }: { email: string }) {
    return this.authService.forgetPassword(email);
  }

  @Post('reset-password')
  resetPassword(
    @Body()
    { email, otp, password }: { email: string; otp: string; password: string },
  ) {
    return this.authService.resetPassword(email, otp, password);
  }
}
