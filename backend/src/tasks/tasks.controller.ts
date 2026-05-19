import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() body: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    projectId: string;
    creatorId: string;
    assigneeId?: string;
    dueDate?: string;
  }) {
    return this.tasksService.create(body);
  }

  @Get()
  findByProject(@Query('projectId') projectId: string) {
    return this.tasksService.findByProject(projectId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.tasksService.update(id, body);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string; order: number }) {
    return this.tasksService.updateStatus(id, body.status, body.order);
  }

  @Patch(':id/order')
  reorder(@Param('id') id: string, @Body() body: { order: number }) {
    return this.tasksService.reorder(id, body.order);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}
