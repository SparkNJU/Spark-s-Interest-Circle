import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Circle } from './circle.entity';


export enum MessageType {
    TOPIC = 'TOPIC', // 主题帖
    REPLY = 'REPLY', // 回复帖
}

@Entity('message')
export class Message {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 32
    })
    username: string;

    @Column()
    uid: number;

    @Column({
        length: 500,
        default: 'zsbd'
    })
    text: string;

    @Column()
    activityLevel: number;

    @Column({
        nullable: true
    })
    imageUrl?: string;

    @Column({
        type: 'enum',
        enum: MessageType,
        default: MessageType.TOPIC
    })
    type: MessageType;

    @ManyToOne(() => Circle, { nullable: true })
    circle: Circle; // 关联的圈子

    @Column({ nullable: true })
    replyToId: number | null;

    @ManyToOne(() => Message, { nullable: true })
    replyTo: Message | null;
}
