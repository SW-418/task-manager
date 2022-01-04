import {ObjectId} from "mongodb";

export class JWTToken {
    token: string
    _id: ObjectId

    constructor(token: string, id: ObjectId) {
        this.token = token;
        this._id = id;
    }
}
