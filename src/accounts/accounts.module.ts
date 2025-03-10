import { forwardRef, Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, PrismaService, UsersService],
  imports: [MailModule, forwardRef(() => UsersModule)],
})
export class AccountsModule {}
