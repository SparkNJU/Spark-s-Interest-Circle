import { Controller, Get, Inject, Post, Provide, Query } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import * as path from 'path';
import * as fs from 'fs';
import { MessageService } from "../service/message.service";

@Provide()
@Controller('/message')
export class MessageController {
    @Inject()
    ctx: Context;

    @Inject()
    messageService: MessageService;

    @Get('/')
    async list(): Promise<any> {
        const list = await this.messageService.list();
        return list;
    }

    @Post('/')
    async post(): Promise<any> {
        const cookieText = this.ctx.cookies.get('my_session_data');
        let cookies = null;
        if (cookieText) {
            cookies = JSON.parse(cookieText);
        }

        // 处理请求体和文件
        const body = this.ctx.request.body as any;
        const files = (this.ctx.request as any).files;
        const text = body.text || ''; // 确保 text 是一个字符串
        let imageUrl = null;

        // 调试日志
        console.log('Body:', body);
        console.log('Files:', files);

        if (files && files.image && files.image.size>0) {
            const image = files.image;

            // 确保 image 对象有必要的属性
            if (!image.filepath) {
                console.error('Image filepath is undefined');
                throw new Error('Image filepath is undefined');
            }

            const uploadDir = path.join(__dirname, '../../public/uploads'); // 上传文件目录
            console.log('Upload Directory Path:', uploadDir);

            const ext = path.extname(image.originalFilename || ''); // 使用 originalFilename 获取文件扩展名
            const fileName = `${Date.now()}${ext}`;
            const filePath = path.join(uploadDir, fileName);

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // 读取文件并保存到指定目录
            fs.writeFileSync(filePath, fs.readFileSync(image.filepath));
            imageUrl = `/uploads/${fileName}`; // 图片 URL
        } else {
            console.warn('No image file found in the request');
        }

        console.log('Text:', text);
        console.log('Image URL:', imageUrl);

        await this.messageService.post(cookies.id, text, imageUrl);

        this.ctx.redirect('/');
    }

    @Get('/posts')
    async getPosts(@Query('page') page: number = 1) {
        const { results, total, page: currentPage, totalPages } = await this.messageService.list(page);
        return { results, total, currentPage, totalPages };
    }
}
