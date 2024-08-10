import { Controller, Get, Provide, Inject } from '@midwayjs/core';
// import { todoList } from './api.controller';
import { Context } from '@midwayjs/koa';
import { RenderService } from '../service/render.service';
import { MessageService } from '../service/message.service';

@Provide()
@Controller('/')
export class HomeController {
  @Inject()
  renderService: RenderService
  @Inject()
  ctx: Context;
  @Inject()
  messageService: MessageService;

  @Get('/')
  async home() {
    const text = this.ctx.cookies.get('my_session_data')
    let cookies = null;
    if(text){
      cookies = JSON.parse(text);
    }
    const msgList = await this.messageService.list();
    return this.renderService.render('home',{cookies, msgList})
  }
  @Get('/register')
  async register() {
    return this.renderService.render('register', {})
  }
  @Get('/login')
  async login() {
    return this.renderService.render('login', {})
  }
}
