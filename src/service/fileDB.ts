import { Provide, Scope, ScopeEnum } from "@midwayjs/core";
import { writeFile, readFile, existsSync } from "fs";



export interface Iuser {
    id: number;
    username: String;
    password: String;
}

@Scope(ScopeEnum.Singleton)
@Provide('fileDBService')
export class FileDBService {
    private _userList: Iuser[] = [];

    async list(){
        if(existsSync('./cache')) {
            const buffer = await new Promise((resolve,reject) => readFile('./cache',
                (err, data) => {
                    if(err){
                        return reject(err);
                    }
                    resolve(data);
                }
            ))
            this._userList = JSON.parse(buffer.toString())
        }
        return this._userList;
    }

    async findByUsername(username: String){
        const list = await this.list()
        const idx = list.findIndex((item) => item.username === username)
        return list[idx];
    }

    async add(username: String , password: String){
        const list = await this.list();
        const item = await this.findByUsername(username);
        if(item){
            throw new Error(`用户名${username}已存在`)
            
        }
        const user = {
            id: await this.incrId(),
            username,
            password
        };
        list.push(user);
        await this.flushCache(list);
        return user;
    }

    async del(id: number){
        const list = await this.list();
        const idx = list.findIndex((item) => item.id === id);
        list.splice(idx, 1)
        await this.flushCache(list);
    }

    private async incrId(){
        const list = await this.list();
        let maxId = 0;
        for (const {id} of list){
            if(id > maxId) {
                maxId = id;
            }
        }
        return maxId + 1;
    }

    private async flushCache(list: Iuser[]){
        return new Promise((resolve, reject) => 
        writeFile('./cache' , JSON.stringify(list), (err) => {
            if(err){
                return reject(err);
            }
            resolve(null);
        }))
    }

}

