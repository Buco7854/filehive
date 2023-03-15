class BaseStore{
    constructor(config) {
        this.config = config;
    }
    async get(key){
        throw Error("Non Implemented");
    }
    async set(key, value){
        throw Error("Non Implemented");
    }
    async delete(key, value){
        throw Error("Non Implemented");
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
        return JSON.parse(await this.client.get(this.prefix + key));
    }
    async set(key, value, ex){
        await this.client.set(this.prefix + key, JSON.stringify(value), {'EX': ex});
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
    }
    isExpired(key){
        const info = this.storage[key]
        if (!info){
            return true
        }
        return info[this.expirationKey] <= new Date();

    }
    async get(key){
        if (this.storage[key] !== undefined){
            if (this.isExpired(key)){
                delete this.storage[key];
            }
            else{
                return this.storage[key].value;
            }
        }
       return null
    }
    async set(key, value, ex){
        this.storage[key] = {"value": value};
        let expiry = new Date();
        expiry.setSeconds(expiry.getSeconds() + ex);
        this.storage[key][this.expirationKey] = expiry;
    }

    async delete(key){
        delete this.storage[key];
    }
}

module.exports = {
    MemoryStore,
    RedisStore,
}