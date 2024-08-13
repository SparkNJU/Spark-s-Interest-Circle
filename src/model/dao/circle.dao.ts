import { Provide, Scope, ScopeEnum } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
import { Repository } from "typeorm";
import { Circle } from "../../entity/circle.entity";
import { Message } from "../../entity/message.entity";

@Scope(ScopeEnum.Singleton)
@Provide()
export class CircleDao {
    @InjectEntityModel(Circle)
    CircleModel: Repository<Circle>;

    @InjectEntityModel(Message)
    MessageModel: Repository<Message>;

    async list(page: number = 1, limit: number = 10) {
        const [results, total] = await this.CircleModel.findAndCount({
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
    async listCircles() {
        return this.CircleModel.find(); // 获取所有圈子
    }

    async add(name: string) {
        const circle = new Circle();
        circle.name = name;
        return this.CircleModel.save(circle);
    }

    async getById(id: number) {
        return this.CircleModel.findOne({ where: { id } });
    }

    async getByName(name: string) {
        return this.CircleModel.findOne({ where: { name } });
    }

    async delById(id: number) {
        return this.CircleModel.delete({ id });
    }

    async addMessageToCircle(circleId: number, message: Message) {
        const circle = await this.CircleModel.findOne({ where: { id: circleId } });
        if (!circle) {
            throw new Error('Circle not found');
        }

        message.circle = circle;
        return this.MessageModel.save(message);
    }

    async getMessagesByCircle(circleId: number) {
        return this.MessageModel.find({
            where: { circle: { id: circleId } },
            order: { id: 'DESC' }
        });
    }

}
