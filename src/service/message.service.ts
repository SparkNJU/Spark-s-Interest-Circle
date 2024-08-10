import { Inject, Provide } from "@midwayjs/core";
import { MessageDao } from "../model/dao/message.dao";

@Provide()
export class MessageService{
    @Inject()
    messageDao: MessageDao;

    async list(){
        return this.messageDao.list();
    }

    async post(username: string, text: string){
        return this.messageDao.add(username,text);
    }
}