import { Inject, Provide, Scope, ScopeEnum } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
//import { writeFile, readFile, existsSync } from "fs";
import { Repository } from "typeorm";
import { Message } from "../../entity/message.entity";
import { UserDao } from "./user.dao";



export interface Iuser {
    id: number;
    username: string;
    password: string;
}



@Scope(ScopeEnum.Singleton)
@Provide()
export class MessageDao {
    //private _userList: Iuser[] = [];
    @Inject()
    userDao: UserDao
    //引入Message模型
    @InjectEntityModel(Message)
    MessageModel: Repository<Message>
    
    async list(){
        return this.MessageModel.find();

    }

    async add(id: number , text: string){//此处id是用户id
        let msg = new Message();
        msg.username = await this.userDao.getUsernameById(id);
        msg.text = text;

        const messageResult = await this.MessageModel.save(msg);
        console.log('msg id = ', messageResult.id)
        return msg;
    }

    async delById(id: number){
        return this.MessageModel.delete({id})
    }

    async getById(id: number){
        return this.MessageModel.findOne({ where: { id: id } });
    }

    async updateById(id: number, text: string){
        return this.MessageModel.update({id},{text})
    }
}

