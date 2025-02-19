import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcyrpt from 'bcrypt'
import { MailService } from 'src/mail/mail.service';
import { generateOTP } from 'src/utils/otp_generator';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private mailService: MailService){}
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcyrpt.hash(createUserDto.password, roundsOfHashing)
    createUserDto.password = hashedPassword
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 *1000);
    const newUser = this.prisma.user.create({data: {...createUserDto, otp, otp_expire:otpExpiry}})
    await this.mailService.sendUserConfirmation(createUserDto, otp)
    return newUser
  }

  async verifyUserOtp(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({where: {email}})
    if(user.otp !== otp) {
      throw new NotFoundException('Invalid OTP')
    }
    if(new Date() > user.otp_expire) {
      throw new NotFoundException('OTP has expired')
    }
    await this.prisma.user.update({
      where: {email},
      data: {status: true, otp: null, otp_expire: null}
    })
    return {message: 'User verified successfully'}
  }

  findAll() {
    const allUsers = this.prisma.user.findMany();
    return allUsers
  }

  findOne(id: string) {
    const foundUser = this.prisma.user.findUnique({where: {id}})
    if(!foundUser) {
      throw new NotFoundException(`User ID ${id} does not exist`)
    }
    return foundUser
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if(updateUserDto.password) {
      updateUserDto.password = await bcyrpt.hash(
        updateUserDto.password,
        roundsOfHashing
      )
    }
    const updateUser = this.prisma.user.update({where: {id}, data: updateUserDto})
    return updateUser
  }

  remove(id: string) {
    const deleteUser = this.prisma.user.delete({where: {id}})

    return deleteUser
  }

  removeAll(){
    const deleteAllUser = this.prisma.user.deleteMany();
    return deleteAllUser;
  }
}
