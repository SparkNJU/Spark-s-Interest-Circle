import { createApp, close, } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import * as assert from 'assert';
//import { UserService } from '../../src/service/user.service';
import { UserDao } from '../../src/model/dao/user.dao';


describe('test/controller/home.test.ts', () => {

  it('should GET /', async () => {
    // create app
    const app = await createApp<Framework>();

    // 根据依赖注入 class 获取实例（推荐）
    const userDao = await app.getApplicationContext().getAsync<UserDao>(UserDao);

    const res = await userDao.list();
    assert.strictEqual(JSON.stringify(res), JSON.stringify([
      {"id":1,"username":"Spark","password":"231462"}
    ]))


    // close app
    await close(app);
  });

});