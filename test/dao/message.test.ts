import { createApp, close, } from '@midwayjs/mock';
import { Framework } from '@midwayjs/koa';
import * as assert from 'assert';
import { MessageDao } from '../../src/model/dao/message.dao';


describe('test/controller/home.test.ts', () => {

  it('should GET /', async () => {
    // create app
    const app = await createApp<Framework>();

    // 根据依赖注入 class 获取实例（推荐）
    const messageDao = await app.getApplicationContext().getAsync<MessageDao>(MessageDao);

    //创建测试
    const res1 = await messageDao.add('Spark', 'hello');
    const list1 = await messageDao.list()
    const newMsg = list1[list1.length-1];
    assert.deepStrictEqual(res1, newMsg);
    //console.log(list1)
    
    //const list2 = await messageDao.list()
    //console.log(list2)
    //更新测试
    const updateText = 'hello world'
    await messageDao.updateById(res1.id,updateText)
    const res2 = await messageDao.getById(res1.id)
    assert.strictEqual(res2?.text,updateText)
    //删除测试
    await messageDao.delById(res1.id)
    const res3 = await messageDao.getById(res1.id)
    assert(!res3);

    // close app
    await close(app);
  });

});