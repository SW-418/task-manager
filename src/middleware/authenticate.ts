import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { UserDto } from "../models/dtos/user-dto";

const authenticate = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers["authorization"]?.replace('Bearer ', '')
        if(!token) {
            throw new Error("Auth token not found")
        }
        const jwtSecret = process.env.JWT_SECRET
        const decoded = jwt.verify(token, "secret") as JwtPayload
        const user = await UserDto.findOne({ _id: decoded["_id"], 'tokens.token': token })
        if(!user) {
            throw new Error("Auth token not found")
        }
        req.user = user
        req.token = token
        next()
    } catch(error) {
        res.status(401).send("error: Not authenticated")
    }
}

export { authenticate }
