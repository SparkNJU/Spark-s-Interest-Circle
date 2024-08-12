import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 32
    })
    username: string;

    @Column({
        length: 32
    })
    password: string;

    @Column()
    activityLevel: number;
  }