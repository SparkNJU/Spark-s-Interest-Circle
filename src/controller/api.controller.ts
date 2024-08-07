import { Inject, Controller, Get, Query, Post } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';

export const todoList = [];


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
  async addTodo() {
    const body = this.ctx.request.body as { text?: string };
    
    const text = body.text; // 标准访问方式
    if (typeof text === 'string') {
      todoList.push({ text }); // 假设 `todoList` 需要存储对象
    } else {
      console.error('Invalid or missing text field');
    }
  
    this.ctx.redirect('/');
    return 'ok';
  }
  

  @Get('/todo')
  async getTodo(){
    return todoList
  }
}


