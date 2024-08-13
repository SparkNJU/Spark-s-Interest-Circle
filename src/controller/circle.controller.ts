import { Controller, Get, Post, Inject, Provide, Query, Param } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { CircleService } from "../service/circle.service";
import { MessageService } from "../service/message.service";
import { Message, MessageType } from "../entity/message.entity";

@Provide()
@Controller('/circle')
export class CircleController {
    @Inject()
    ctx: Context;

    @Inject()
    circleService: CircleService;

    @Inject()
    messageService: MessageService;

    @Post('/add')
    async addCircle(): Promise<any> {
        const body = await this.ctx.request.body as any;
        const name = await body.name || '';

        if (!name) {
            this.ctx.throw(400, 'Circle name is required');
        }

        await this.circleService.add(name);
        return this.ctx.redirect('/');
    }

    @Get('/list')
    async list(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<any> {
        const { results, total, page: currentPage, totalPages } = await this.circleService.list(page, limit);
        return { results, total, currentPage, totalPages };
    }

    @Get('/:id')
    async getById(@Param('id') id: number): Promise<any> {
        const circle = await this.circleService.getById(id);
        if (!circle) {
            this.ctx.throw(404, 'Circle not found');
        }
        return circle;
    }

    @Get('/name/:name')
    async getByName(@Param('name') name: string): Promise<any> {
        const circle = await this.circleService.getByName(name);
        if (!circle) {
            this.ctx.throw(404, 'Circle not found');
        }
        return circle;
    }

    @Post('/:circleId/message')
    async addMessage(@Param('circleId') circleId: number): Promise<any> {
        const body = this.ctx.request.body as any;
        const text = body.text || '';
        const imageUrl = body.imageUrl || null;
        const type = body.type || MessageType.TOPIC; // 默认为主题帖

        if (!text) {
            this.ctx.throw(400, 'Message text is required');
        }

        const message = new Message();
        message.username = this.ctx.cookies.get('username'); // 或其他方式获取用户名
        message.uid = Number(this.ctx.cookies.get('userId')); // 确保用户ID是数字类型
        message.text = text;
        message.imageUrl = imageUrl;
        message.type = type;

        const result = await this.circleService.addMessageToCircle(circleId, message);
        return result;
    }

    @Get('/:circleId/messages')
    async getMessages(@Param('circleId') circleId: number): Promise<any> {
        const messages = await this.circleService.getMessagesByCircle(circleId);
        return messages;
    }
}
