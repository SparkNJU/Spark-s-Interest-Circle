import { Inject, Controller, Post, Get, Provide } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { IGetUserResponse } from '../interface';


interface userBody{
  id:number;
  username: string;
  password: string;
}

@Provide()
@Controller('/user')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/register')
  async register():Promise<IGetUserResponse> {
    const regBody:userBody = this.ctx.request.body as userBody;
    if((!regBody.username) || (!regBody.password)){
      //密码或者用户名为空
      this.ctx.status = 500;
      return { success: false, message: '用户名或密码不能为空' };
    }
    const user = await this.userService.register(regBody.username,regBody.password);
    return { success: true, message: 'OK', data: user };
  }

  @Post('/login')
  async login():Promise<IGetUserResponse> {
    const logBody:userBody = this.ctx.request.body as userBody;
    const success = await this.userService.login(logBody.id, logBody.password);
    if(success){
      //成功登录
      logBody.username = await this.userService.getUsernameById(logBody.id);
      this.ctx.cookies.set('my_session_data', JSON.stringify(logBody))
      this.ctx.redirect('/')
      return;
    }else{
      this.ctx.status = 403
    }
    
  }

  @Get('/logout')
  async logout(){
    this.ctx.cookies.set('my_session_data','')
    this.ctx.redirect('/')
  }
}
