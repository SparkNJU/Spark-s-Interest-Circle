import { Provide, Scope, ScopeEnum } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
//import { writeFile, readFile, existsSync } from "fs";
import { Repository } from "typeorm";
import { Message } from "../../entity/message.entity";



export interface Iuser {
    id: number;
    username: string;
    password: string;
}

@Scope(ScopeEnum.Singleton)
@Provide()
export class MessageDao {
    //private _userList: Iuser[] = [];

    //引入Message模型
    @InjectEntityModel(Message)
    MessageModel: Repository<Message>
    
    async list(){
        return this.MessageModel.find();

    }

    async add(username: string , text: string){
        let msg = new Message();
        msg.username = username;
        msg.text = text;

        const messageResult = await this.MessageModel.save(msg);
        console.log('msg id = ', messageResult.id)
        return msg;
    }

}

