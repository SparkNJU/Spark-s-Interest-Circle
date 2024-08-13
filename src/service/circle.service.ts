import { Inject, Provide } from "@midwayjs/core";
import { CircleDao } from "../model/dao/circle.dao";
import { Message } from "../entity/message.entity";
import { MessageDao } from "../model/dao/message.dao";

@Provide()
export class CircleService {
    @Inject()
    circleDao: CircleDao;

    @Inject()
    messageDao: MessageDao;

    async list(page: number = 1, limit: number = 10) {
        return this.circleDao.list(page, limit);
    }
    async listCircles() {
        return this.circleDao.listCircles(); // 获取所有圈子
    }
    async add(name: string) {
        return this.circleDao.add(name);
    }

    async getById(id: number) {
        return this.circleDao.getById(id);
    }

    async getByName(name: string) {
        return this.circleDao.getByName(name);
    }

    async deleteById(id: number) {
        return this.circleDao.delById(id);
    }

    async addMessageToCircle(circleId: number, message: Message) {
        return this.circleDao.addMessageToCircle(circleId, message);
    }

    async getMessagesByCircle(circleId: number) {
        return this.circleDao.getMessagesByCircle(circleId);
    }
    async listMessagesByCircle(circle: string, page: number, limit: number) {
        return this.messageDao.listMessagesByCircle(circle, page, limit);
    }
}
