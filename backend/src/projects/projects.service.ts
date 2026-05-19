import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; description?: string; color?: string; userId: string }) {
    const project = await this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        color: data.color || '#6366f1',
        members: {
          create: { userId: data.userId, role: 'owner' },
        },
      },
      include: { members: { include: { user: true } }, _count: { select: { tasks: true } } },
    });
    return project;
  }

  async findAll(userId: string) {
    return this.prisma.project.findMany({
      where: { members: { some: { userId } } },
      include: {
        members: { include: { user: true } },
        _count: { select: { tasks: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        members: { include: { user: true } },
        tasks: {
          include: { assignee: true, labels: { include: { label: true } }, _count: { select: { comments: true } } },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async update(id: string, data: { name?: string; description?: string; color?: string }) {
    return this.prisma.project.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}
