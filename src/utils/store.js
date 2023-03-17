class BaseStore{
    constructor(config) {
        this.config = config;
        this.sessionIdleMaxTime = 30 * 60 * 1000;
    }
    async get(key){
        throw Error("Non Implemented!");
    }
    async set(key, value){
        throw Error("Non Implemented!");
    }
    async delete(key, value){
        throw Error("Non Implemented!");
    }
}

class RemoteStore extends BaseStore{
    constructor(client , ...args) {
        super(...args);
        this.client = client;
        this.prefix = this.config['store-prefix'] + ":";
    }
}

class RedisStore extends RemoteStore{
    async get(key){
        const value = JSON.parse(await this.client.get(this.prefix + key))
        if (value && value["is_session"]){
            await this.client.sendCommand(["PEXPIRE", this.prefix + key, String(this.sessionIdleMaxTime)])
        }
        return value;
    }
    async set(key, value, px){
        if(value["is_session"]){
            // Same as in MemoryStore
            px = this.sessionIdleMaxTime
        }
        await this.client.set(this.prefix + key, JSON.stringify(value), {'PX': px});
    }
    async delete(key){
        await this.client.del(this.prefix + key);
    }
}


class MemoryStore extends BaseStore{
    constructor(...args) {
        super(...args)
        this.expirationKey = "filehive-max-age"
        this.storage = {};
        setInterval(() => {
            for (let key of Object.keys(this.storage)){
                if(this.isExpired(key)){
                    delete this.storage[key]
                }
            }
        }, this.sessionIdleMaxTime / 3)
    }
    getExpirationTime(px){
        let expireAt = new Date();
        expireAt.setMilliseconds(expireAt.getMilliseconds() + px);
        return expireAt
    }
    isExpired(key){
        const info = this.storage[key]
        if (!info){
            return true
        }
        return info[this.expirationKey] <= new Date();
    }
    async get(key){
        let value = null;
        if (this.storage[key] !== undefined){
            if (this.isExpired(key)){
                delete this.storage[key];
            }
            else{
                value = this.storage[key].value;
                if (value["is_session"]){
                    this.storage[key][this.expirationKey] = this.getExpirationTime(this.sessionIdleMaxTime)
                }
            }
        }
       return value
    }
    async set(key, value, px){
        this.storage[key] = {"value": value};
        // could have checked if px but ig its more readable ike this
        if(value["is_session"]){
            // We add a short expire time that we will increase each time the user session is retrieved
            // This avoids having sessions stored forever
            px = this.sessionIdleMaxTime
        }
        this.storage[key][this.expirationKey] = this.getExpirationTime(px);
    }
    async delete(key){
        delete this.storage[key];
    }
}

module.exports = {
    MemoryStore,
    RedisStore,
}