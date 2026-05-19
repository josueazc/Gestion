import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async upsert(data: { email: string; name?: string; id?: string }) {
    return this.prisma.user.upsert({
      where: { email: data.email },
      update: { name: data.name },
      create: {
        id: data.id,
        email: data.email,
        name: data.name || data.email.split('@')[0],
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
