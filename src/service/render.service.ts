import { Provide, Scope, ScopeEnum } from "@midwayjs/core";
import { renderFile } from "ejs";
import { join } from "path";


@Scope(ScopeEnum.Singleton)
@Provide()
export class RenderService {
    async render(file:string, locals:any){
            return renderFile(join(__dirname,`../view/${file}.ejs`),locals)
    }
}