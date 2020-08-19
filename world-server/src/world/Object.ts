import cryptoRandomString = require('crypto-random-string');
export abstract class GameObject {
    public id: string = '';
    constructor(){
        this.id = cryptoRandomString({ length: 10 });
    }
}
