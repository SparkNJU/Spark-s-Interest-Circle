import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Message } from './message.entity';


@Entity('circle')
export class Circle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100,
        unique: true
    })
    name: string; // 圈子的名称，例如 "politics"

    @OneToMany(() => Message, message => message.circle)
    messages: Message[]; // 该圈子包含的所有消息
}
