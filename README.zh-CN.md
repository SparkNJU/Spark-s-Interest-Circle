# Spark's Interest Circle
## 南京大学2023-2024第二学期暑期课程《web开发》课程作业

## 快速入门

<!-- 在此次添加使用文档 -->
tailwindCSS编译指令  npx tailwindcss -i ./src/input.css -o ./public/styles/tailwind.css --watch

如需进一步了解，参见 [midway 文档][midway]。

### 本地开发

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### 部署

```bash
$ npm start
```

### 内置指令

- 使用 `npm run lint` 来做代码风格检查。
- 使用 `npm test` 来执行单元测试。


[midway]: https://midwayjs.org
这个错误表明 this.ctx.request 的类型并不包含 files 属性。这可能是因为 TypeScript 无法识别 koa-body 的扩展类型。

解决方案：

扩展 koa 的类型定义：

你需要扩展 koa 的类型定义以包括 files 属性。可以在你的项目中创建一个自定义的类型定义文件，例如 typings/koa.d.ts，并添加以下内容：

typescript
复制代码
import * as Koa from 'koa';

declare module 'koa' {
  interface Request {
    files?: {
      [key: string]: any; // 如果知道具体类型可以更准确地定义
    };
  }
}
更新 koa-body 的类型定义：

确保你已正确安装 koa-body 和相关的类型定义包。如果没有，你可以尝试重新安装或检查版本：

bash
复制代码
npm install koa-body
npm install @types/koa-body
如果没有提供类型定义，你可以使用自定义的类型定义文件。

修正 MessageController 中的代码：

更新 MessageController 以处理文件上传，并确保 TypeScript 能正确识别 files 属性：

typescript
复制代码
import { Controller, Get, Inject, Post, Provide, Query } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import * as path from 'path';
import * as fs from 'fs';
import { MessageService } from "../service/message.service";
import koaBody from 'koa-body';

interface MessageBody {  
    text: string;  
    imageUrl?: string; // 处理图片 URL
}  

@Provide()
@Controller('/message')
export class MessageController {
    @Inject()
    ctx: Context;

    @Inject()
    messageService: MessageService;

    @Post('/')
    async post(): Promise<any> {
        // 先应用 koa-body 中间件处理请求体和文件
        await koaBody({
            multipart: true,
            parsedMethods: ['POST']
        })(this.ctx as any, async () => {});

        const cookieText = this.ctx.cookies.get('my_session_data');
        let cookies = null;
        if (cookieText) {
            cookies = JSON.parse(cookieText);
        }

        const { text } = this.ctx.request.body as MessageBody;
        let imageUrl = null;

        // 确保 ctx.request.files 具有正确的类型
        const files = (this.ctx.request.files || {}) as { [key: string]: any };
        if (files.image) {
            const image = files.image;
            const uploadDir = path.join(__dirname, '../public/uploads'); // 上传文件目录
            const ext = path.extname(image.name);
            const fileName = `${Date.now()}${ext}`;
            const filePath = path.join(uploadDir, fileName);

            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            fs.writeFileSync(filePath, fs.readFileSync(image.path));
            imageUrl = `/uploads/${fileName}`; // 图片 URL
        }

        await this.messageService.post(cookies.id, text, imageUrl);

        this.ctx.redirect('/');
    }

    @Get('/')
    async list(): Promise<any> {
        const list = await this.messageService.list();
        return list;
    }

    @Get('/posts')
    async getPosts(@Query('page') page: number = 1) {
        const { results, total, page: currentPage, totalPages } = await this.messageService.list(page);
        return { results, total, currentPage, totalPages };
    }
}
确保 koa-body 中间件顺序：

在 config.default.ts 中，确保 koa-body 中间件在其他中间件之前被正确加载。

这样可以帮助 TypeScript 识别 files 属性，解决你遇到的类型问题。



