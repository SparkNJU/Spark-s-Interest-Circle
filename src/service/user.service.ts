import { Provide , Inject} from '@midwayjs/core';
import { IUserOptions } from '../interface';
import { UserDao } from '../model/dao/user.dao';

@Provide()
export class UserService {
  @Inject()
  userDao: UserDao;


  // 将用户数据插入数据库
  async register(username: string, password: string) {
    try {  
      const user = await this.userDao.add(username, password);  
      // 如果用户被成功创建，可以返回用户信息或简单的成功消息  
      return { success: true, user };  
    } catch (error) {  
    // 捕获来自 userDao.add 的异常  
    // 返回一个包含错误信息的对象给前端  
      return { success: false, error: error.message };  
    }  
  }

  // 检查用户名和密码是否匹配
  async login(username: string, password: string) {
    const user = await this.userDao.findByUsername(username);
    if(user.password === password){
      return true;
    }else{
      return false;
    }

  }

  async getUser(options: IUserOptions) {
    return {
      uid: options.uid,
      username: 'mockedName',
      phone: '12345678901',
      email: 'xxx.xxx@xxx.com',
    };
  }
}
