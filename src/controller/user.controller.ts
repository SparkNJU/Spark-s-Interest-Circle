import { Inject, Controller, Post, Get, Provide } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { IGetUserResponse } from '../interface';

interface UserBody {
  id?: number; // `id` 可能在注册时为空，因此可以是可选的
  username?: string; // `username` 可能在通过 ID 登录时为空
  password: string;
  activityLevel?: number; // `activityLevel` 是可选的
}

@Provide()
@Controller('/user')
export class UserController {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Post('/register')
  async register(): Promise<IGetUserResponse> {
    const regBody: UserBody = this.ctx.request.body as UserBody;

    if (!regBody.username || !regBody.password) {
      this.ctx.status = 400; 
      return { success: false, message: '用户名或密码不能为空' };
    }

    try {
      const user = await this.userService.register(regBody.username, regBody.password);
      if (user.error) {
        this.ctx.status = 403;
        return { success: false, message: user.error };
      }
      return user;
    } catch (error) {
      console.error(error);
      this.ctx.status = 500;
      return { success: false, message: '注册失败' };
    }
  }

  @Post('/login')
  async login(): Promise<IGetUserResponse> {
    const logBody: UserBody = this.ctx.request.body as UserBody;

    if ((!logBody.id && !logBody.username) || !logBody.password) {
      this.ctx.status = 400;
      return { success: false, message: '用户ID、用户名或密码不能为空' };
    }

    try {
      let user;
      if (logBody.id) {
        user = await this.userService.findById(logBody.id);
        if (user && user.password === logBody.password) {
          logBody.username = user.username;
        }else{
          this.ctx.status = 403;
          return { success: false, message: '登录失败' };
        }
        
      } else if (logBody.username) {
        user = await this.userService.findByUsername(logBody.username);
        if (user && user.password === logBody.password) {
          logBody.id = user.id;
        }else{
          this.ctx.status = 403;
          return { success: false, message: '登录失败' };
        }
      }

      if (user) {
        logBody.activityLevel = await this.userService.getActLevelById(logBody.id);
        this.ctx.cookies.set('my_session_data', JSON.stringify(logBody));
        return { success: true, message: '登录成功' };
      } else {
        this.ctx.status = 403;
        return { success: false, message: '登录失败' };
      }
    } catch (error) {
      console.error(error);
      this.ctx.status = 500;
      return { success: false, message: '登录失败' };
    }
  }

  @Get('/logout')
  async logout() {
    this.ctx.cookies.set('my_session_data', '');
    this.ctx.redirect('/');
  }
}
