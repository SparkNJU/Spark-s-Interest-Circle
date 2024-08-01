import { Inject, Controller, Get, Query, Post } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

const todoList = [];


@Controller('/api')
export class APIController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Get('/get_user')
  async getUser(@Query('uid') uid) {
    const user = await this.userService.getUser({ uid });
    return { success: true, message: 'OK', data: user };
  }

  @Post('/todo')
  async addTodo(){
    const text = this.ctx.request.body
    todoList.push(text);
    this.ctx.redirect('/api/todo')
    return 'ok'
  }

  @Get('/todo')
  async getTodo(){
    return todoList
  }
}


