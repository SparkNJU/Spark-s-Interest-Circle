import { Inject, Provide, Scope, ScopeEnum } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Repository } from "typeorm";
import { Message, MessageType } from "../../entity/message.entity";
import { UserDao } from "./user.dao";
import { Circle } from "../../entity/circle.entity";

@Scope(ScopeEnum.Singleton)
@Provide()
export class MessageDao {
    @Inject()
    userDao: UserDao;

    @InjectEntityModel(Message)
    MessageModel: Repository<Message>;

    @InjectEntityModel(Circle)
    CircleModel: Repository<Circle>;

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

    async add(id: number, text: string, imageUrl?: string, circleName: string = "综合区", type: MessageType = MessageType.TOPIC) {
        let msg = new Message();
        msg.username = await this.userDao.getUsernameById(id);
        msg.uid = id;
        msg.text = text;
        msg.imageUrl = imageUrl || null; // 处理图片 URL
        msg.type = type; // 使用传入的类型或默认值

        // 查找名为 `circleName` 的圈子
        let circle = await this.CircleModel.findOne({ where: { name: circleName } });
        if (!circle) {
            // 如果没有找到，则创建一个新的圈子
            circle = this.CircleModel.create({ name: circleName });
            await this.CircleModel.save(circle);
        }
        msg.circle = circle; // 关联到找到或创建的圈子

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
        // 增加用户的活跃度
        const user = await this.userDao.findById(id);
        if (user) {
            user.activityLevel += 1;
            await this.userDao.UserModel.save(user);
        }
    }
    async listMessagesByCircle(circleName: string, page: number = 1, limit: number = 10) {
        // 查询圈子实体
        const circle = await this.CircleModel.findOne({ where: { name: circleName } });
        
        if (!circle) {
            throw new Error(`Circle with name "${circleName}" not found`);
        }

        // 使用圈子实体进行消息查询
        const [results, total] = await this.MessageModel.findAndCount({
            where: { circle: circle }, // 使用查询到的 Circle 实体
            skip: (page - 1) * limit,
            take: limit,
            order: { id: 'DESC' }
        });

        return {
            results,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }
}
