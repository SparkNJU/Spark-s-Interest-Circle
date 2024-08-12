import { Inject, Provide } from "@midwayjs/core";
import { MessageDao } from "../model/dao/message.dao";

@Provide()
export class MessageService {
    @Inject()
    messageDao: MessageDao;

    async list(page: number = 1, limit: number = 10) {
        return this.messageDao.list(page, limit);
    }

    async post(id: number, text: string) {
        return this.messageDao.add(id, text);
    }
}
