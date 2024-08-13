import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
        default: 'zsbd' // 设置默认值为 'zsbd'
    })
    text: string;

    @Column()
    activityLevel: number;

    @Column({
        nullable: true
    })
    imageUrl?: string; // 用于存储图片 URL
}
