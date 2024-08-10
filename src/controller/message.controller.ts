import { Controller, Get, Inject, Post, Provide } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { MessageService } from "../service/message.service";

interface MessageBody {  
    text: string;  
    // 可以添加其他属性  
}  

@Provide()
@Controller('/message')
export class MessageController{
    @Inject()
    ctx: Context;

    @Inject()
    messageService: MessageService;

    @Get('/')
    async list():Promise<any>{
        const list = await this.messageService.list();
        return list;
    }
    @Post('/')
    async post():Promise<any>{
        const cookieText = this.ctx.cookies.get('my_session_data')
        let cookies = null;
        if(cookieText){
          cookies = JSON.parse(cookieText);
        }
        const { text } = this.ctx.request.body as MessageBody;
        console.log(cookies.username, text);
        this.messageService.post(cookies.username, text);

        
        this.ctx.redirect('/')
        
    
    }
}