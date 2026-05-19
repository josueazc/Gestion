import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus, TaskPriority } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    projectId: string;
    creatorId: string;
    assigneeId?: string;
    dueDate?: string;
  }) {
    // Get the max order for this status in the project
    const maxOrder = await this.prisma.task.aggregate({
      where: { projectId: data.projectId, status: (data.status as TaskStatus) || 'BACKLOG' },
      _max: { order: true },
    });

    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: (data.status as TaskStatus) || 'BACKLOG',
        priority: (data.priority as TaskPriority) || 'NONE',
        order: (maxOrder._max.order ?? -1) + 1,
        projectId: data.projectId,
        creatorId: data.creatorId,
        assigneeId: data.assigneeId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
      include: {
        assignee: true,
        creator: true,
        labels: { include: { label: true } },
        _count: { select: { comments: true } },
      },
    });
  }

  async findByProject(projectId: string) {
    return this.prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: true,
        labels: { include: { label: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: {
        assignee: true,
        creator: true,
        labels: { include: { label: true } },
        comments: { include: { author: true }, orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async update(id: string, data: any) {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status as TaskStatus;
    if (data.priority !== undefined) updateData.priority = data.priority as TaskPriority;
    if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId || null;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;

    return this.prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        assignee: true,
        labels: { include: { label: true } },
        _count: { select: { comments: true } },
      },
    });
  }

  async updateStatus(id: string, status: string, order: number) {
    return this.prisma.task.update({
      where: { id },
      data: { status: status as TaskStatus, order },
      include: {
        assignee: true,
        labels: { include: { label: true } },
        _count: { select: { comments: true } },
      },
    });
  }

  async reorder(id: string, order: number) {
    return this.prisma.task.update({
      where: { id },
      data: { order },
    });
  }

  async remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}
