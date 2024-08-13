declare module 'koa-body' {
  import * as Koa from 'koa';

  interface FormidableOptions {
    uploadDir?: string;
    keepExtensions?: boolean;
  }

  interface KoaBodyOptions {
    multipart?: boolean;
    formidable?: FormidableOptions;
    parsedMethods?: string[];
  }

  function koaBody(options?: KoaBodyOptions): Koa.Middleware;

  export = koaBody;
}
