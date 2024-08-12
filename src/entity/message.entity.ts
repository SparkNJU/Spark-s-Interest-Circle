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
        length: 500
    })
    text: string;

    @Column()
    activityLevel: number;
  }