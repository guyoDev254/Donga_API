import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: CreateUserDto, otp: string) {
    console.log(otp);
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confrimation',
      context: {
        name: user.name,
        otp,
      },
    });
  }

  async sendForgotPasswordOtp(email: string, name: string, otp: string) {
    console.log(otp);
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password OTP',
      template: './confrimation',
      context: {
        name: name,
        otp,
      },
    });
  }

  async sendAccountCreationEmail(email: string, name: string, accNo: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: '🎉 Welcome to DongaBank – Your Digital Wallet is Ready',
      template: './accountCreate',
      context: {
        name: name,
        accNo,
      },
    });
  }
}
