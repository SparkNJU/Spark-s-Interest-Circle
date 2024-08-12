import { Inject, Provide, Scope, ScopeEnum } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Repository } from "typeorm";
import { Message } from "../../entity/message.entity";
import { UserDao } from "./user.dao";

@Scope(ScopeEnum.Singleton)
@Provide()
export class MessageDao {
    @Inject()
    userDao: UserDao;

    @InjectEntityModel(Message)
    MessageModel: Repository<Message>;

    async list(page: number = 1, limit: number = 10) {
        const [results, total] = await this.MessageModel.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { id: 'DESC' } // 这里可以按需要调整排序规则
        });

        return {
            results,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async add(id: number, text: string) {
        let msg = new Message();
        msg.username = await this.userDao.getUsernameById(id);
        msg.uid = id;
        msg.text = text;

        await this.IncActLevelById(id);
        msg.activityLevel = 1 + (await this.userDao.getActLevelById(id));

        const messageResult = await this.MessageModel.save(msg);
        console.log('msg id = ', messageResult.id);
        return msg;
    }

    async delById(id: number) {
        return this.MessageModel.delete({ id });
    }

    async getById(id: number) {
        return this.MessageModel.findOne({ where: { id } });
    }

    async updateById(id: number, text: string) {
        return this.MessageModel.update({ id }, { text });
    }

    async IncActLevelById(id: number) {
        const user = await this.userDao.findById(id);
        if (user) {
            user.activityLevel += 1;
            await this.userDao.UserModel.save(user);
        }
    }
}
