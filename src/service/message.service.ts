import { Inject, Provide } from "@midwayjs/core";
import { MessageDao } from "../model/dao/message.dao";
import { MessageType } from "../entity/message.entity";

@Provide()
export class MessageService {
    @Inject()
    messageDao: MessageDao;

    async list(page: number = 1, limit: number = 10) {
        return this.messageDao.list(page, limit);
    }

    async post(id: number, text: string, imageUrl?: string, circleName: string = "综合区", type: MessageType = MessageType.TOPIC) {
        return this.messageDao.add(id, text, imageUrl, circleName, type);
    }
}
