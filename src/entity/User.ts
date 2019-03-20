import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Book } from './Book';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({
        nullable: true,
    })
    nickname: string;
    @Column()
    openid: string;
    @ManyToMany(type => Book)
    @JoinTable()
    liked_books: Book[];
    @ManyToMany(type => Book)
    @JoinTable()
    recently_books: Book[];
}
