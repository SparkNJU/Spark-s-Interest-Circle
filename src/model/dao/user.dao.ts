import { Provide, Scope, ScopeEnum } from "@midwayjs/core";
import { InjectEntityModel } from "@midwayjs/typeorm";
//import { writeFile, readFile, existsSync } from "fs";
import { User } from "../../entity/user.entity";
import { Repository } from "typeorm";



export interface Iuser {
    id: number;
    username: string;
    password: string;
}

@Scope(ScopeEnum.Singleton)
@Provide()
export class UserDao {
    //private _userList: Iuser[] = [];

    //引入User模型
    @InjectEntityModel(User)
    UserModel: Repository<User>
    
    async list(){
        return this.UserModel.find();
        //用文件进行读写
        // if(existsSync('./cache')) {
        //     const buffer = await new Promise((resolve,reject) => readFile('./cache',
        //         (err, data) => {
        //             if(err){
        //                 return reject(err);
        //             }
        //             resolve(data);
        //         }
        //     ))
        //     this._userList = JSON.parse(buffer.toString())
        // }
        // return this._userList;
    }

    async findByUsername(username: string){
    //     const list = await this.list()
    //     const idx = list.findIndex((item) => item.username === username)
    //     return list[idx];
        const user = await this.UserModel.findOne({
            where:{
                username: username
            }
        })
        if(user){
            return user;
        }else{
            return null;
        }
    }

    async add(username: string , password: string){
        let user = new User();
        user.username = username;
        user.password = password;

        const userResult = await this.UserModel.save(user);
        console.log('user id = ', userResult.id)
        //const list = await this.list();
        const item = await this.findByUsername(username);
        if(item){
            throw new Error(`用户名${username}已存在`)
            
        }
        return user;

        // const user = {
        //     id: await this.incrId(),
        //     username,
        //     password
        // };
        // list.push(user);
        // await this.flushCache(list);
        // return user;
    }

//     async del(id: number){
//         const list = await this.list();
//         const idx = list.findIndex((item) => item.id === id);
//         list.splice(idx, 1)
//         await this.flushCache(list);
//     }

//     private async incrId(){
//         const list = await this.list();
//         let maxId = 0;
//         for (const {id} of list){
//             if(id > maxId) {
//                 maxId = id;
//             }
//         }
//         return maxId + 1;
//     }

//     private async flushCache(list: Iuser[]){
//         return new Promise((resolve, reject) => 
//         writeFile('./cache' , JSON.stringify(list), (err) => {
//             if(err){
//                 return reject(err);
//             }
//             resolve(null);
//         }))
//     }

 }

