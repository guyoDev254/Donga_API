import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entity/auth.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { generateOTP } from 'src/utils/otp_generator';
import { MailService } from 'src/mail/mail.service';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
      user,
    };
  }

  async forgetPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    const otp: string = await generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await this.prisma.user.update({
      where: { email },
      data: { otp, otp_expire: otpExpiry },
    });
    await this.mailService.sendForgotPasswordOtp(user.email, user.name, otp);
    return { message: 'OTP sent successfully' };
  }

  async resetPassword(email: string, otp: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }
    if (user.otp !== otp) {
      throw new NotFoundException('Invalid OTP');
    }
    if (new Date() > user.otp_expire) {
      throw new NotFoundException('OTP has expired');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword, otp: null, otp_expire: null },
    });
    return { message: 'Password reset successfully' };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: changePasswordDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `No user found for id: ${changePasswordDto.userId}`,
      );
    }
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.oldPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: changePasswordDto.userId },
      data: { password: hashedPassword },
    });
    return { message: 'Password changed successfully' };
  }
}
