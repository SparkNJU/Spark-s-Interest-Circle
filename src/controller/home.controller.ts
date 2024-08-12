import { Controller, Get, Provide, Inject, Query } from '@midwayjs/core';
// import { todoList } from './api.controller';
import { Context } from '@midwayjs/koa';
import { RenderService } from '../service/render.service';
import { MessageService } from '../service/message.service';

@Provide()
@Controller('/')
export class HomeController {
  @Inject()
  renderService: RenderService;

  @Inject()
  ctx: Context;

  @Inject()
  messageService: MessageService;

  @Get('/')
  async home(@Query('page') page: number = 1) {
    const cookieText = this.ctx.cookies.get('my_session_data');
    let cookies = null;
    if (cookieText) {
      cookies = JSON.parse(cookieText);
    }
    
    const { results, total, page: currentPage, totalPages } = await this.messageService.list(page);
    
    return this.renderService.render('home', {
      cookies,
      results,
      total,
      currentPage,
      totalPages
    });
  }

  @Get('/register')
  async register() {
    return this.renderService.render('register', {});
  }

  @Get('/login')
  async login() {
    return this.renderService.render('login', {});
  }
}

