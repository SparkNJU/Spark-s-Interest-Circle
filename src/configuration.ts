import { Configuration, App } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as view from '@midwayjs/view-ejs'; 
import * as orm from '@midwayjs/typeorm'; 
import koaBody from 'koa-body'; // 使用默认导出
import { join } from 'path';
import { ReportMiddleware } from './middleware/report.middleware';
import * as staticFile from '@midwayjs/static-file';

@Configuration({
  imports: [
    koa,
    validate,
    staticFile,
    view,
    orm,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  async onReady() {
    // 添加 koa-body 中间件
    this.app.use(koaBody({
      multipart: true, // 允许上传文件
      //formLimit: '56mb', // 表单数据大小限制
      //jsonLimit: '1mb', // JSON 数据大小限制
      //textLimit: '1mb', // 纯文本大小限制
    }));

    // add middleware
    this.app.useMiddleware([ReportMiddleware]);
    // add filter
    // this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
