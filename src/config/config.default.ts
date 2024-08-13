import { MidwayConfig } from '@midwayjs/core';
import { User } from '../entity/user.entity';
import { Message } from '../entity/message.entity';
import path = require('path');
import { Circle } from '../entity/circle.entity';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1721529887359_1765',
  koa: {
    port: 7001,
    middleware: [
      'koaBody',
      // 其他中间件
    ]
  },
  koaBody: {
    multipart: true, // 支持 multipart 表单数据（如文件上传）
    formidable: {
      uploadDir: path.join(__dirname, '../public/uploads'), // 文件上传目录
      keepExtensions: true, // 保留文件扩展名
    }
  },
  typeorm: {
    dataSource: {
      default: {
        /**
         * 单数据库实例
         */
        type: 'mysql',
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: 'z3298699MySQL',
        database: 'interest_circle',
        synchronize: true,     // 如果第一次使用，不存在表，有同步的需求可以写 true，注意会丢数据
        logging: false,

        // 配置实体模型
        entities: [
          User,
          Message,
          Circle
        ],

        // // 支持如下的扫描形式，为了兼容我们可以同时进行.js和.ts匹配，⬇️
        // entities: [
        //   'entity',             // 特定目录
        //   '**/abc/**',          // 仅获取包含 abc 字符的目录下的文件
        //   'abc/**/*.{j,t}s',        // 特定目录 + 通配
        //   'abc/*.entity.{j,t}s',    // 匹配后缀
        //   '**/*.entity.{j,t}s',     // 通配加后缀匹配
        //   '**/*.{j,t}s',        // 后缀匹配
        // ]
      }
    }
  },
} as MidwayConfig;
