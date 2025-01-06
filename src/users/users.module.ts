import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, MulterModule.register({dest: './uploads'})]
})
export class UsersModule {}
