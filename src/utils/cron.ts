import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CronService {
  constructor(private prisma: PrismaService) {}

  @Cron('0 * * * *')
  async deleteExpiredOtps() {
    await this.prisma.user.updateMany({
      where: { otp_expire: { lt: new Date() } },
      data: { otp: null, otp_expire: null },
    });
  }
}
