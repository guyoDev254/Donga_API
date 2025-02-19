import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { AccountsModule } from './accounts/accounts.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, MailModule, AccountsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
