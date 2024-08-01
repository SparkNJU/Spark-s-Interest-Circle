import { MidwayConfig, MidwayAppInfo } from '@midwayjs/core';

export default (appInfo: MidwayAppInfo) => {
  return {
    // use for cookie sign key, should change to your own and keep security
    keys: appInfo.name + '_1722427694200_2535',
    egg: {
      port: 7001,
    },
    baseDir:'app/public'
    // security: {
    //   csrf: false,
    // },
  } as MidwayConfig;
};

