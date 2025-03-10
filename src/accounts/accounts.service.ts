import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { generateAccNumber } from '../utils/account_generator';
import { MailService } from "../mail/mail.service";

@Injectable()
export class AccountsService {
  constructor(
    private prismaService: PrismaService,
    private userService: UsersService,
    private mailService: MailService,
  ) {}
  async create(createAccountDto: CreateAccountDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: createAccountDto.userId },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const generatedAccNumber: string = generateAccNumber(
      createAccountDto.userId,
    );

    const newAccount = await this.prismaService.account.create({
      data: {
        userId: createAccountDto.userId,
        accountNumber: generatedAccNumber,
        balance: createAccountDto.balance,
        currency: createAccountDto.currency,
      },
    });
    await this.mailService.sendAccountCreationEmail(
      user.email,
      user.name,
      generatedAccNumber,
    );
    return {
      message: 'Account created successfully',
      newAccount,
    };
  }

  findAll() {
    const allAcc = this.prismaService.account.findMany();
    return allAcc;
  }

  findOne(id: string) {
    const foundAccount = this.prismaService.account.findUnique({
      where: { id: id },
    });
    if (!foundAccount) {
      throw new NotFoundException('Account Not Found');
    }
    return foundAccount;
  }

  async update(id: string, updateAccountDto: UpdateAccountDto) {
    const foundAccount = await this.prismaService.account.findUnique({
      where: { id: id },
    });
    if (!foundAccount) {
      throw new NotFoundException('Account Not Found');
    }
    const updatedAccount = await this.prismaService.account.update({
      where: { id: id },
      data: updateAccountDto,
    });
    return {
      message: 'Account updated successfully',
      updatedAccount,
    };
  }

  async remove(id: string) {
    const foundAccount = await this.prismaService.account.findUnique({
      where: { id: id },
    });
    if (!foundAccount) {
      throw new NotFoundException('Account Not Found');
    }
    const removeAccount = await this.prismaService.account.delete({
      where: { id: id },
    });
    return {
      message: 'Account removed successfully',
      removeAccount,
    };
  }

  removeAllAccounts() {
    return this.prismaService.account.deleteMany();
  }
}
