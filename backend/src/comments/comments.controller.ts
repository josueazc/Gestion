import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() body: { content: string; taskId: string; authorId: string }) {
    return this.commentsService.create(body);
  }

  @Get()
  findByTask(@Query('taskId') taskId: string) {
    return this.commentsService.findByTask(taskId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}
