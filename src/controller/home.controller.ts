import { Controller, Get, Provide, Inject, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { RenderService } from '../service/render.service';
import { MessageService } from '../service/message.service';
import { CircleService } from '../service/circle.service'; // 假设你有这个服务

@Provide()
@Controller('/')
export class HomeController {
  @Inject()
  renderService: RenderService;

  @Inject()
  ctx: Context;

  @Inject()
  messageService: MessageService;

  @Inject()
  circleService: CircleService; // 注入 CircleService

  @Get('/')
  async home(@Query('page') page: number = 1, @Query('circle') circle: string = '综合区') {
    const cookieText = this.ctx.cookies.get('my_session_data');
    let cookies = null;
    if (cookieText) {
      cookies = JSON.parse(cookieText);
    }

    // 获取圈子列表
    const circles = await this.circleService.listCircles();

    // 获取当前圈子下的帖子
    const { results, total, page: currentPage, totalPages } = await this.circleService.listMessagesByCircle(circle, page,10);

    return this.renderService.render('home', {
      cookies,
      results,
      total,
      currentPage,
      totalPages,
      circles,        // 传递圈子数据
      currentCircle: circle // 传递当前圈子
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
